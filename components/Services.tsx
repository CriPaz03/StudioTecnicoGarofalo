"use client";
import Image from "next/image";
import { useState } from "react";
import { services } from "@/lib/site";
import {MoveUpRight} from "lucide-react";
export default function Services() {
  const [active, setActive] = useState(0);
  return (
    <section className="section services" id="servizi">
      <div className="section-heading">
        <p className="eyebrow">02 / LE NOSTRE COMPETENZE</p>
        <h2>
          Servizi tecnici
          <br />
          <span className="muted">a Bitonto.</span>
        </h2>
        <p>
          Progettazione 2D e 3D, modellazione BIM e render, pratiche edilizie,
          accatastamenti e attestati di prestazione energetica: individuiamo
          il servizio adatto al tuo immobile e all’intervento previsto.
        </p>
      </div>
      <div className="services-layout">
        <div className="service-visual">
          <div className="service-image-wrap">
            <Image
              key={services[active].image}
              src={`/images/${services[active].image}.webp`}
              alt={`Visualizzazione architettonica: ${services[active].title}`}
              fill
              sizes="(max-width: 800px) 100vw, 40vw"
            />
          </div>
          <div className="image-caption">
            <span>STUDIO TECNICO GAROFALO</span>
            <span>{services[active].tag}</span>
          </div>
        </div>
        <div className="service-list">
          {services.map((s, i) => (
            <div
              className={`service-row ${active === i ? "active" : ""}`}
              key={s.title}
            >
              <h3>
                <button
                  aria-expanded={active === i}
                  aria-controls={`service-${i}`}
                  onClick={() => setActive(i)}
                >
                  <span className="service-number">0{i + 1}</span>
                  <span>{s.title}</span>
                  <span className="service-symbol" aria-hidden="true">
                    {active === i ? "−" : "+"}
                  </span>
                </button>
              </h3>
              <div id={`service-${i}`} hidden={active !== i}>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
