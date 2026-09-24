import Image from "next/image";
import Header, {Brand} from "@/components/Header";
import IdeaToReality from "@/components/IdeaToReality";
import Services from "@/components/Services";
import ImmersiveGallery from "@/components/ImmersiveGallery";
import ContactForm from "@/components/ContactForm";
import {siteConfig, processSteps, faqs, projects} from "@/lib/site";
import {MoveDown, MoveUpRight} from "lucide-react";

export default function Home() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: siteConfig.name,
        description: siteConfig.description,
        ...(siteConfig.url
            ? {url: siteConfig.url, image: `${siteConfig.url}/images/og.jpg`}
            : {}),
        ...(siteConfig.email ? {email: siteConfig.email} : {}),
        ...(siteConfig.phone ? {telephone: siteConfig.phone} : {}),
        address: {"@type": "PostalAddress", ...siteConfig.address},
        vatID: siteConfig.vatId,
        hasMap: siteConfig.mapsUrl,
        ...(siteConfig.areaServed ? {areaServed: siteConfig.areaServed} : {}),
        knowsAbout: [
            "Progettazione 2D e 3D",
            "Revit",
            "Render fotorealistici",
            "Lumion",
            "CILA",
            "SCIA",
            "Accatastamenti",
            "Certificazioni energetiche APE",
        ],
    };
    return (
        <>
            <Header/>
            <main id="contenuto">
                <section className="hero" aria-labelledby="hero-title">
                    <Image
                        className="hero-image"
                        src="/images/living-day.webp"
                        alt="Progetto di soggiorno contemporaneo con zona pranzo, legno e luce naturale"
                        fill
                        sizes="100vw"
                        preload
                        quality={85}
                    />
                    <div className="hero-shade"/>
                    <div className="hero-content">
                        <p className="eyebrow">
                            <span className="tiny-line"/> PROGETTAZIONE · VISUALIZZAZIONE ·
                            SERVIZI TECNICI
                        </p>
                        <h1 id="hero-title">
                            Dall’idea
                            <br/>
                            alla <em>realtà.</em>
                        </h1>
                        <div className="hero-bottom">
                            <div>
                                <p className="hero-description">
                                    Progettiamo spazi, li modelliamo e li rendiamo visibili prima
                                    ancora che prendano forma.
                                </p>
                                <div className="hero-actions">
                                    <a className="button" href="#contatti">
                                        Parliamo del tuo progetto <span aria-hidden="true"><MoveUpRight/></span>
                                    </a>
                                    <a className="text-link" href="#progetti">
                                        Esplora i progetti <span aria-hidden="true"><MoveUpRight/></span>
                                    </a>
                                </div>
                            </div>
                            <a className="scroll-cue" href="#dall-idea-alla-realta">
                                <span>SCOPRI IL PERCORSO</span>
                                <span className="scroll-circle" aria-hidden="true">
                  <MoveDown/>
                </span>
                            </a>
                        </div>
                    </div>
                    <div className="hero-footer">
                        <span>STUDIO TECNICO GAROFALO</span>
                        <span>UN’IDEA. OGNI SUA DIMENSIONE.</span>
                        <span>01 - 05</span>
                    </div>
                </section>
                <IdeaToReality/>
                <Services/>
                <ImmersiveGallery/>
                <section className="section process" id="metodo">
                    <div className="section-heading">
                        <p className="eyebrow">04 / UN METODO, PASSO DOPO PASSO</p>
                        <h2>
                            La precisione è<br/>
                            <em>un percorso.</em>
                        </h2>
                        <p>
                            Ogni fase prepara la successiva.
                            <br/>
                            Ogni scelta mantiene al centro il tuo progetto.
                        </p>
                    </div>
                    <ol className="process-list">
                        {processSteps.map(([title, text], i) => (
                            <li key={title}>
                                <span className="process-number">0{i + 1}</span>
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </li>
                        ))}
                    </ol>
                </section>
                <section className="section selected">
                    <div className="section-heading selected-heading">
                        <div>
                            <p className="eyebrow">NEL DETTAGLIO</p>
                            <h2>
                                Spazi diversi.
                                <br/>
                                <span className="muted">La stessa attenzione.</span>
                            </h2>
                        </div>
                        <a className="text-link" href="#progetti">
                            Esplora tutta la gallery <span aria-hidden="true"><MoveUpRight/></span>
                        </a>
                    </div>
                    <div className="selected-grid">
                        {[projects[1], projects[2], projects[8]].map((p, i) => (
                            <figure key={p.image}>
                                <div className="selected-image">
                                    <Image
                                        src={`/images/${p.image}.webp`}
                                        alt={p.alt}
                                        fill
                                        sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 40vw"
                                    />
                                </div>
                                <figcaption>
                  <span>
                    <small>
                      0{i + 1} / {p.category}
                    </small>
                      {p.title}
                  </span>
                                    <span aria-hidden="true"><MoveUpRight/></span>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </section>
                <section className="section faq" id="domande">
                    <div>
                        <p className="eyebrow">PRIMA DI INIZIARE</p>
                        <h2>
                            Facciamo
                            <br/>
                            <em>chiarezza.</em>
                        </h2>
                    </div>
                    <div className="faq-list">
                        {faqs.map(([q, a]) => (
                            <details key={q}>
                                <summary>
                                    {q}
                                    <span aria-hidden="true">+</span>
                                </summary>
                                <p>{a}</p>
                            </details>
                        ))}
                    </div>
                </section>
                <section className="section contact" id="contatti">
                    <div className="contact-copy">
                        <p className="eyebrow">05 / IL PROSSIMO PROGETTO</p>
                        <h2>
                            Hai un progetto
                            <br/>
                            <em>in mente?</em>
                        </h2>
                        <p>
                            Raccontaci cosa vuoi realizzare. Ti aiutiamo a trasformarlo in un
                            progetto chiaro, concreto e visualizzabile.
                        </p>
                        <span className="contact-arrow" aria-hidden="true">
              <MoveUpRight/>
            </span>
                        <div className="contact-details">
                            <address className="studio-address">
                                {siteConfig.address.streetAddress}<br/>
                                {siteConfig.address.postalCode} {siteConfig.address.addressLocality} ({siteConfig.address.addressRegion})
                            </address>
                            <a className="text-link location-link" href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer">
                                Apri la posizione su Google Maps <MoveUpRight aria-hidden="true"/>
                            </a>
                            {siteConfig.email && (
                                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                            )}
                            {siteConfig.phone && (
                                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                                    {siteConfig.phone}
                                </a>
                            )}
                            {siteConfig.whatsapp && (
                                <a
                                    href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Scrivici su WhatsApp <MoveUpRight/>
                                </a>
                            )}
                        </div>
                        <p className="vat-number">P. IVA {siteConfig.vatId}</p>
                    </div>
                    <ContactForm
                        enabled={Boolean(
                            process.env.CONTACT_WEBHOOK_URL && siteConfig.privacyUrl,
                        )}
                    />
                </section>
            </main>
            <footer className="footer section">
                <div className="footer-top">
                    <Brand/>
                    <p>
                        Progettare con precisione.
                        <br/>
                        Vedere oltre il disegno.
                    </p>
                    <a className="text-link" href="#">
                        Torna all’inizio ↑
                    </a>
                </div>
                <address className="footer-contacts">
                    <a href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer">
                        {siteConfig.address.streetAddress} · {siteConfig.address.postalCode} {siteConfig.address.addressLocality} ({siteConfig.address.addressRegion})
                    </a>
                    <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>
                    <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </address>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} Studio Tecnico Garofalo</span>
                    <span className="footer-vat">P. IVA {siteConfig.vatId}</span>
                    {siteConfig.privacyUrl && <a href={siteConfig.privacyUrl}>Privacy</a>}
                </div>
            </footer>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />
        </>
    );
}
