import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/Header";
import { siteConfig } from "@/lib/site";

const title = "Informativa privacy | Studio Tecnico Garofalo";
const description = "Informazioni sul trattamento dei dati personali durante la navigazione e l’invio di richieste a Studio Tecnico Garofalo.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: siteConfig.url ? `${siteConfig.url}/privacy` : null },
  openGraph: { title, description, type: "website", locale: "it_IT", ...(siteConfig.url ? { url: `${siteConfig.url}/privacy` } : {}) },
  twitter: { card: "summary", title, description },
};

const contents = [
  ["titolare", "Chi tratta i tuoi dati"],
  ["dati", "Quali dati raccogliamo"],
  ["finalita", "Finalità e basi giuridiche"],
  ["conferimento", "Dati obbligatori e facoltativi"],
  ["conservazione", "Conservazione e sicurezza"],
  ["fornitori", "Destinatari e trasferimenti"],
  ["cookie", "Cookie e servizi esterni"],
  ["diritti", "I tuoi diritti"],
  ["aggiornamenti", "Aggiornamenti"],
] as const;

export default function PrivacyPage() {
  return <>
    <header className="legal-header section">
      <Brand href="/" />
      <Link className="text-link" href="/#contatti">Torna ai contatti <span aria-hidden="true">↗</span></Link>
    </header>
    <main id="contenuto" className="legal-page section">
      <div className="legal-intro">
        <p className="eyebrow">STUDIO TECNICO GAROFALO / PRIVACY</p>
        <h1>Informativa <em>privacy.</em></h1>
        <p>Come vengono trattati i tuoi dati quando visiti il sito o ci racconti il tuo progetto.</p>
        <p className="legal-date">Ultimo aggiornamento: <time dateTime={siteConfig.privacyUpdatedAt}>1 ottobre 2026</time></p>
      </div>
      <div className="legal-layout">
        <nav className="legal-index" aria-label="Indice dell’informativa">
          <p className="eyebrow">IN QUESTA PAGINA</p>
          <ol>{contents.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ol>
        </nav>
        <article className="legal-content" aria-label="Informativa sul trattamento dei dati personali">
          <p>Questa informativa, resa ai sensi dell’articolo 13 del Regolamento (UE) 2016/679 (GDPR), riguarda i dati trattati attraverso questo sito. Eventuali incarichi professionali sono accompagnati dalle informazioni relative agli ulteriori trattamenti necessari alla loro esecuzione.</p>
          <section id="titolare">
            <h2>01 — Chi tratta i tuoi dati</h2>
            <p>Il titolare del trattamento è <strong>{siteConfig.name}</strong>, P. IVA {siteConfig.vatId}, con sede in {siteConfig.address.streetAddress}, {siteConfig.address.postalCode} {siteConfig.address.addressLocality} ({siteConfig.address.addressRegion}), Italia.</p>
            <p>Per informazioni o richieste sui tuoi dati puoi scrivere a <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> oppure contattare lo studio al <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>.</p>
          </section>
          <section id="dati">
            <h2>02 — Quali dati raccogliamo</h2>
            <ul>
              <li><strong>Dati del modulo:</strong> nome, email, telefono se fornito, servizio richiesto, contenuto del messaggio e conferma di lettura dell’informativa.</li>
              <li><strong>Comunicazioni dirette:</strong> recapiti e informazioni che scegli di inviare per email, telefono o WhatsApp, se utilizzato.</li>
              <li><strong>Dati tecnici di navigazione:</strong> indirizzo IP, informazioni sulla richiesta, browser e dispositivo, e dati necessari all’erogazione e alla sicurezza del sito, che possono essere trattati dai servizi di hosting.</li>
            </ul>
            <p>Nel messaggio inserisci solo le informazioni necessarie a descrivere il progetto. Non inviare dati sanitari, documenti d’identità o altre informazioni sensibili tramite questo modulo.</p>
          </section>
          <section id="finalita">
            <h2>03 — Finalità e basi giuridiche</h2>
            <p><strong>Rispondere alle richieste e valutare il progetto.</strong> I recapiti e il messaggio vengono utilizzati per gestire la richiesta e le attività precontrattuali richieste dall’interessato, ai sensi dell’articolo 6, paragrafo 1, lettera b) del GDPR.</p>
            <p><strong>Far funzionare e proteggere il sito.</strong> I dati tecnici sono trattati per erogare il servizio e prevenire abusi, sulla base del legittimo interesse alla sicurezza e al corretto funzionamento del sito, ai sensi dell’articolo 6, paragrafo 1, lettera f).</p>
            <p><strong>Adempiere agli obblighi di legge.</strong> Quando applicabile, il trattamento si basa sull’articolo 6, paragrafo 1, lettera c).</p>
            <p>Il modulo non prevede l’iscrizione a newsletter o comunicazioni promozionali. La casella privacy conferma la lettura dell’informativa; non costituisce un consenso al marketing.</p>
          </section>
          <section id="conferimento">
            <h2>04 — Dati obbligatori e facoltativi</h2>
            <p>Inviare una richiesta è facoltativo. Nome, email, servizio e messaggio sono necessari per gestirla; senza questi dati il modulo non può essere inviato. Il telefono è facoltativo. La conferma di lettura dell’informativa è richiesta prima dell’invio.</p>
          </section>
          <section id="conservazione">
            <h2>05 — Conservazione e sicurezza</h2>
            <p>Le richieste e la corrispondenza sono conservate per il tempo necessario a rispondere, gestire gli eventuali approfondimenti e completare le attività precontrattuali. La necessità di conservarle viene valutata in relazione allo stato della richiesta, alla prosecuzione dei contatti e all’eventuale incarico.</p>
            <p>Se viene conferito un incarico, alcuni dati possono essere conservati ulteriormente per gli obblighi contrattuali, amministrativi e di legge o per la tutela di diritti. I dati tecnici seguono le finalità di sicurezza e i criteri di conservazione dei servizi utilizzati.</p>
            <p>I dati vengono trattati con strumenti informatici e comunicazioni email. Il sito usa HTTPS e controlli di validazione del modulo. L’accesso alle richieste è limitato alle persone e ai fornitori coinvolti nella loro gestione.</p>
          </section>
          <section id="fornitori">
            <h2>06 — Destinatari e trasferimenti</h2>
            <p>Le richieste vengono recapitate allo studio. I dati possono essere trattati dai fornitori necessari al funzionamento del sito e delle comunicazioni, e comunicati alle autorità quando richiesto dalla legge.</p>
            <ul>
              <li><strong>Cloudflare:</strong> hosting del sito, distribuzione dei contenuti, sicurezza e gestione delle funzioni che elaborano il modulo. <a href="https://www.cloudflare.com/policies/privacy/" target="_blank" rel="noopener noreferrer">Informazioni sulla privacy di Cloudflare</a>.</li>
              <li><strong>Resend:</strong> servizio utilizzato per trasmettere le email del modulo; riceve i recapiti e il contenuto necessari all’invio. <a href="https://resend.com/legal/dpa" target="_blank" rel="noopener noreferrer">Accordo sul trattamento dei dati di Resend</a>.</li>
              <li><strong>Fornitore della casella email:</strong> gestione e conservazione delle comunicazioni ricevute e inviate dallo studio.</li>
            </ul>
            <p>L’utilizzo di questi servizi può comportare trattamenti al di fuori dello Spazio economico europeo, anche negli Stati Uniti. I trasferimenti seguono le garanzie previste dagli articoli 44 e seguenti del GDPR, comprese decisioni di adeguatezza applicabili e clausole contrattuali standard secondo gli accordi dei fornitori. Puoi richiedere allo studio ulteriori informazioni sulle garanzie utilizzate.</p>
          </section>
          <section id="cookie">
            <h2>07 — Cookie e servizi esterni</h2>
            <p>Il codice del sito non integra cookie pubblicitari, strumenti di profilazione o analytics di terze parti. Il fornitore di hosting può usare strumenti tecnici necessari alla sicurezza e all’erogazione del servizio.</p>
            <p>Immagini, font e video del sito sono serviti dal sito stesso. Google Maps viene aperto attraverso un link: non è presente una mappa incorporata. Anche email e WhatsApp aprono servizi esterni solo quando scegli di usarli; il loro trattamento dei dati è disciplinato dalle rispettive informative.</p>
          </section>
          <section id="diritti">
            <h2>08 — I tuoi diritti</h2>
            <p>Nei casi previsti dal GDPR puoi chiedere accesso ai tuoi dati, rettifica, cancellazione, limitazione del trattamento e portabilità. Puoi opporti ai trattamenti basati sul legittimo interesse per motivi connessi alla tua situazione particolare.</p>
            <p>Per esercitare i diritti scrivi a <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>, indicando la richiesta. Se necessario, lo studio può chiedere informazioni proporzionate per verificare l’identità del richiedente.</p>
            <p>Puoi presentare reclamo al <a href="https://www.garanteprivacy.it/home/i-miei-diritti" target="_blank" rel="noopener noreferrer">Garante per la protezione dei dati personali</a>. Il modulo non prevede decisioni automatizzate con effetti giuridici o analogamente significativi, né profilazione.</p>
          </section>
          <section id="aggiornamenti">
            <h2>09 — Aggiornamenti</h2>
            <p>L’informativa viene aggiornata quando cambiano il funzionamento del sito, i servizi utilizzati o i trattamenti descritti. La data in alto identifica la versione del documento.</p>
          </section>
          <Link className="button" href="/#contatti">Torna al modulo di contatto <span aria-hidden="true">↗</span></Link>
        </article>
      </div>
    </main>
    <footer className="legal-footer section"><span>{siteConfig.name} · P. IVA {siteConfig.vatId}</span><Link href="/">Torna al sito</Link></footer>
  </>;
}
