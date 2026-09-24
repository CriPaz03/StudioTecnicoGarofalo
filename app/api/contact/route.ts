import { services } from "@/lib/site";

const error = (message: string, status: number) =>
  Response.json({ error: message }, { status });
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    origin &&
    origin !== new URL(request.url).origin &&
    origin !== process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
  )
    return error("Richiesta non consentita.", 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return error("Formato non valido.", 415);
  if (Number(request.headers.get("content-length")) > 16000)
    return error("Messaggio troppo lungo.", 413);
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 16000) return error("Messaggio troppo lungo.", 413);
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
  } catch {
    return error("Dati non validi.", 400);
  }
  const field = (key: string) =>
    typeof body[key] === "string" ? (body[key] as string).trim() : "";
  const name = field("name"),
    email = field("email"),
    phone = field("phone"),
    service = field("service"),
    message = field("message");
  if (field("website")) return error("Richiesta non valida.", 400);
  if (
    name.length < 2 ||
    name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    phone.length > 30 ||
    message.length < 10 ||
    message.length > 5000 ||
    field("privacy") !== "accepted" ||
    ![
      ...services.map((s) => s.title),
      "Vorrei un consiglio sul mio progetto",
    ].includes(service)
  )
    return error("Controlla i campi obbligatori e il consenso privacy.", 422);
  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint || !process.env.NEXT_PUBLIC_PRIVACY_URL)
    return error(
      "Il servizio di contatto non è ancora attivo. Nessun messaggio è stato inviato.",
      503,
    );
  try {
    if (new URL(endpoint).protocol !== "https:")
      throw new Error("Invalid configuration");
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CONTACT_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        service,
        message,
        privacy: true,
        source: "studio-tecnico-garofalo",
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(12000),
      redirect: "error",
    });
    if (!result.ok)
      return error(
        "Non è stato possibile inviare la richiesta. Riprova tra poco.",
        502,
      );
    return Response.json({ success: true });
  } catch {
    return error(
      "Il servizio non è disponibile al momento. Riprova tra poco.",
      502,
    );
  }
}
