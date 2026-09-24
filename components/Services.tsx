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
          Una visione completa.
          <br />
          <span className="muted">In ogni fase.</span>
        </h2>
        <p>
          Dal primo disegno alla documentazione tecnica.
          <br />
          Un percorso che tiene insieme spazio, estetica e precisione.
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
                <a className="text-link" href="#contatti">
                  Parliamone <span aria-hidden="true"><MoveUpRight /></span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
