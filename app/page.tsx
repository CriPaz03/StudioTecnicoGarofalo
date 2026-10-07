import Image from "next/image";
import Header, {Brand} from "@/components/Header";
import IdeaToReality from "@/components/IdeaToReality";
import Services from "@/components/Services";
import ImmersiveGallery from "@/components/ImmersiveGallery";
import ProjectFilm from "@/components/ProjectFilm";
import SelectedProjects from "@/components/SelectedProjects";
import ContactForm from "@/components/ContactForm";
import {siteConfig, processSteps, faqs} from "@/lib/site";
import {MoveDown, MoveUpRight} from "lucide-react";

export default function Home() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: siteConfig.name,
        description: siteConfig.description,
        ...(siteConfig.url
            ? {url: siteConfig.url, image: `${siteConfig.url}/images/og.jpg`, logo: `${siteConfig.url}/brand/mark.webp`}
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
                        <h1 id="hero-title" className="hero-location">
                            Studio tecnico e geometra a Bitonto
                        </h1>
                        <p className="hero-tagline">
                            Dall’idea
                            <br/>
                            alla <em>realtà.</em>
                        </p>
                        <div className="hero-bottom">
                            <div>
                                <p className="hero-description">
                                    Studio Tecnico Garofalo: progettazione degli spazi, pratiche
                                    edilizie e catastali, certificazioni energetiche APE e render
                                    fotorealistici. Seguiamo privati, imprese e professionisti
                                    dalla prima valutazione alla documentazione del progetto.
                                </p>
                            </div>
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
                <ProjectFilm/>
                <section className="section process" id="metodo">
                    <div className="section-heading">
                        <p className="eyebrow">04 / UN METODO, PASSO DOPO PASSO</p>
                        <h2>
                            Come seguiamo<br/>
                            <em>il tuo progetto.</em>
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
                {/*<SelectedProjects/>*/}
                <section className="section faq" id="domande">
                    <div>
                        <p className="eyebrow">PRIMA DI INIZIARE</p>
                        <h2>
                            Domande sui
                            <br/>
                            <em>servizi tecnici.</em>
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
                <section className="section contact" id="contatti" aria-labelledby="contact-title">
                    <div className="contact-copy">
                        <p className="eyebrow">05 / CONTATTI</p>
                        <h2 id="contact-title">
                            Hai un progetto
                            <br/>
                            <em>in mente?</em>
                        </h2>
                        <p>
                            Chiamaci, scrivici un’email oppure compila il modulo.
                            Partiamo dalle tue esigenze per definire il progetto e il servizio più adatto.
                        </p>
                        <div className="contact-details">
                            {siteConfig.phone && (
                                <div className="contact-channel">
                                    <p className="contact-label">TELEFONO</p>
                                    <a className="contact-value" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                                        {siteConfig.phone.replace(/(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3")}
                                        <MoveUpRight aria-hidden="true"/>
                                    </a>
                                    <p className="contact-hint">Chiama lo studio</p>
                                </div>
                            )}
                            {siteConfig.email && (
                                <div className="contact-channel">
                                    <p className="contact-label">EMAIL</p>
                                    <a className="contact-value" href={`mailto:${siteConfig.email}`}>
                                        {siteConfig.email}<MoveUpRight aria-hidden="true"/>
                                    </a>
                                    <p className="contact-hint">Scrivici direttamente</p>
                                </div>
                            )}
                            <div className="contact-channel">
                                <p className="contact-label">DOVE SIAMO</p>
                                <a
                                    className="contact-value"
                                    href={siteConfig.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <address className="studio-address">
                                        {siteConfig.address.streetAddress}<br/>
                                        {siteConfig.address.postalCode} {siteConfig.address.addressLocality} ({siteConfig.address.addressRegion})
                                    </address>  <MoveUpRight aria-hidden="true"/>
                                </a>
                            </div>
                            {siteConfig.whatsapp && (
                                <div className="contact-channel">
                                    <p className="contact-label">WHATSAPP</p>
                                    <a
                                        className="contact-value"
                                        href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Scrivici su WhatsApp <MoveUpRight aria-hidden="true"/>
                                    </a>
                                </div>
                            )}
                        </div>
                        <p className="vat-number">P. IVA {siteConfig.vatId}</p>
                    </div>
                    <ContactForm
                        enabled={Boolean(
                            process.env.NEXT_PUBLIC_CONTACT_ENABLED === "true" && siteConfig.privacyUrl,
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
