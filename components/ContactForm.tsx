"use client";
import { useRef, useState, type FormEvent } from "react";
import { services, siteConfig } from "@/lib/site";
import {MoveUpRight} from "lucide-react";
export default function ContactForm({ enabled }: { enabled: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const status = useRef<HTMLParagraphElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    const form = event.currentTarget;
    setState("loading");
    setMessage("Invio della richiesta in corso…");
    try {
      const data = Object.fromEntries(new FormData(form));
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(18000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true)
        throw new Error(
          result.error || "Invio non riuscito. Riprova tra poco.",
        );
      setState("success");
      setMessage(
        "Richiesta inviata. Grazie per averci raccontato il tuo progetto.",
      );
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "Il servizio non risponde. Riprova tra poco.",
      );
    }
    requestAnimationFrame(() => status.current?.focus());
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Nome <span>*</span>
          <input
            name="name"
            autoComplete="name"
            placeholder="Il tuo nome"
            required
            minLength={2}
            maxLength={100}
          />
        </label>
        <label>
          Email <span>*</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="La tua email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Telefono <span className="optional">(facoltativo)</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Il tuo recapito"
            maxLength={30}
          />
        </label>
        <label>
          Di cosa hai bisogno? <span>*</span>
          <select name="service" required defaultValue="">
            <option value="" disabled>
              Seleziona un servizio
            </option>
            {services.map((s) => (
              <option key={s.title}>{s.title}</option>
            ))}
            <option>Vorrei un consiglio sul mio progetto</option>
          </select>
        </label>
      </div>
      <label>
        Il tuo progetto <span>*</span>
        <textarea
          name="message"
          rows={3}
          placeholder="Raccontaci la tua idea, lo spazio, le tue esigenze…"
          required
          minLength={10}
          maxLength={5000}
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Lascia vuoto
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="privacy-check">
        <input name="privacy" type="checkbox" required value="accepted" />
        <span>
          Ho letto l’
          {siteConfig.privacyUrl ? (
            <a
              href={siteConfig.privacyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              informativa privacy
            </a>
          ) : (
            "informativa privacy (in fase di aggiornamento)"
          )}{" "}
          e acconsento al trattamento dei dati per rispondere alla mia
          richiesta. *
        </span>
      </label>
      <button
        className="button"
        type="submit"
        disabled={!enabled || state === "loading"}
      >
        {state === "loading" ? "Invio in corso…" : "Richiedi una consulenza"}
        <span aria-hidden="true"><MoveUpRight /></span>
      </button>
      {!enabled && (
        <p className="form-note">
          Il modulo di contatto sarà disponibile a breve.
          {siteConfig.email ? (
            <>
              {" "}
              Nel frattempo scrivici a{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </>
          ) : (
            ""
          )}
        </p>
      )}
      <p
        ref={status}
        className={`form-status ${state}`}
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        {message}
      </p>
    </form>
  );
}
