export interface ContactEnv {
  CONTACT_ENABLED?: string;
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
  CONTACT_WEBHOOK_URL?: string;
  CONTACT_WEBHOOK_TOKEN?: string;
}

const error = (message: string, status: number) =>
  Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
export async function handleContact(request: Request, env: ContactEnv, serviceTitles: readonly string[]) {
  if (request.method !== "POST") return error("Metodo non consentito.", 405);
  const origin = request.headers.get("origin");
  if (
    origin &&
    origin !== new URL(request.url).origin
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
      ...serviceTitles,
      "Vorrei un consiglio sul mio progetto",
    ].includes(service)
  )
    return error("Controlla i campi obbligatori e il consenso privacy.", 422);
  const endpoint = env.CONTACT_WEBHOOK_URL;
  if (env.CONTACT_ENABLED !== "true" || (!endpoint && !(env.RESEND_API_KEY && env.CONTACT_FROM && env.CONTACT_TO)))
    return error(
      "Il servizio di contatto non è ancora attivo. Nessun messaggio è stato inviato.",
      503,
    );
  try {
    if (endpoint && new URL(endpoint).protocol !== "https:")
      throw new Error("Invalid configuration");
    const result = await fetch(endpoint || "https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(!endpoint ? { Authorization: `Bearer ${env.RESEND_API_KEY}` } : {}),
        ...(endpoint && env.CONTACT_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${env.CONTACT_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(endpoint ? {
        name,
        email,
        phone,
        service,
        message,
        privacy: true,
        source: "studio-tecnico-garofalo",
        submittedAt: new Date().toISOString(),
      } : {
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        reply_to: email,
        subject: `Richiesta dal sito: ${service}`,
        text: `Nome: ${name}\nEmail: ${email}\nTelefono: ${phone || "Non indicato"}\nServizio: ${service}\n\n${message}\n\nPresa visione informativa privacy: confermata`,
      }),
      signal: AbortSignal.timeout(12000),
      // Workers supports manual/follow. Reject 3xx below without forwarding
      // credentials or form data to a different URL.
      redirect: "manual",
    });
    if (!result.ok)
      return error(
        "Non è stato possibile inviare la richiesta. Riprova tra poco.",
        502,
      );
    if (!endpoint) {
      const accepted = await result.json() as { id?: string };
      if (!accepted.id) return error("Invio non confermato. Riprova tra poco.", 502);
    }
    return Response.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (deliveryError) {
    // Log the exception type only; never expose credentials or form contents.
    console.error("Contact delivery exception", deliveryError instanceof Error ? deliveryError.name : "UnknownError");
    return error(
      "Il servizio non è disponibile al momento. Riprova tra poco.",
      502,
    );
  }
}
