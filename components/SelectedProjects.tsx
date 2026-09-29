"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { MoveUpRight } from "lucide-react";
import { projects, projectGroups } from "@/lib/site";

export default function SelectedProjects() {
  const [group, setGroup] = useState(0);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const items = projects.filter(p => projectGroups[group].categories.includes(p.category));
  const current = items[active];
  const large = expanded === null ? null : items[expanded];
  const isOpen = expanded !== null;

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    const target = opener.current;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      target?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const choose = (index: number) => { setGroup(index); setActive(0); };
  const tabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = { ArrowRight: (index + 1) % projectGroups.length, ArrowLeft: (index + projectGroups.length - 1) % projectGroups.length, Home: 0, End: projectGroups.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = keys[event.key];
    choose(next);
    tabs.current[next]?.focus();
  };
  const open = (index: number, target: HTMLButtonElement) => {
    opener.current = target;
    setExpanded(index);
    dialog.current?.showModal();
  };
  const close = () => { dialog.current?.close(); setExpanded(null); };
  const move = (delta: number) => setExpanded(index => index === null ? null : (index + delta + items.length) % items.length);

  return (
    <section className="section selected" aria-labelledby="selected-title">
      <div className="section-heading selected-heading">
        <div><p className="eyebrow">NEL DETTAGLIO</p><h2 id="selected-title">Spazi diversi.<br /><span className="muted">La stessa attenzione.</span></h2></div>
        <a className="text-link" href="#progetti">Esplora tutta la gallery <MoveUpRight aria-hidden="true" /></a>
      </div>
      <div className="project-tabs" role="tablist" aria-label="Tipologia di progetto">
        {projectGroups.map((item, index) => <button key={item.id} ref={node => { tabs.current[index] = node; }} role="tab" id={`tab-${item.id}`} aria-controls={`panel-${item.id}`} aria-selected={group === index} tabIndex={group === index ? 0 : -1} onClick={() => choose(index)} onKeyDown={event => tabKey(event, index)}>{item.label}</button>)}
      </div>
      {projectGroups.map((item, index) => <div key={item.id} role="tabpanel" id={`panel-${item.id}`} aria-labelledby={`tab-${item.id}`} hidden={group !== index}>
        {group === index && <>
          <div className={`project-composition ${items.length === 1 ? "is-single" : ""}`}>
            <figure className="project-feature">
              <button className="project-photo" onClick={event => open(active, event.currentTarget)} aria-label={`Ingrandisci: ${current.alt}`}>
                <Image src={`/images/${current.image}.webp`} alt={current.alt} fill sizes="(max-width: 700px) 90vw, 65vw" />
                <span className="project-expand"><MoveUpRight aria-hidden="true" /></span>
              </button>
              <figcaption><span>{current.title}</span><span>{active + 1} / {items.length}</span></figcaption>
            </figure>
            {items.length > 1 && <div className="project-side">
              {[1, 2].slice(0, items.length - 1).map(offset => {
                const next = (active + offset) % items.length;
                const photo = items[next];
                return <button key={photo.image} className="project-photo" onClick={event => open(next, event.currentTarget)} aria-label={`Ingrandisci: ${photo.alt}`}><Image src={`/images/${photo.image}.webp`} alt={photo.alt} fill sizes="30vw" /><span className="project-expand"><MoveUpRight aria-hidden="true" /></span></button>;
              })}
            </div>}
          </div>
          {items.length > 1 && <div className="project-thumbnails" aria-label={`Seleziona una foto: ${item.label}`}>
            {items.map((photo, photoIndex) => <button key={photo.image} aria-pressed={active === photoIndex} aria-label={`Mostra: ${photo.alt}`} onClick={() => setActive(photoIndex)}><Image src={`/images/${photo.image}.webp`} alt="" fill sizes="100px" /></button>)}
          </div>}
        </>}
      </div>)}
      <dialog ref={dialog} className="lightbox" aria-label="Dettaglio della selezione" onCancel={close} onClose={() => setExpanded(null)} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); } }}>
        <button className="lightbox-close" onClick={close} aria-label="Chiudi immagine">✕</button>
        {large && <><div className="lightbox-image"><Image src={`/images/${large.image}.webp`} alt={large.alt} fill sizes="95vw" quality={85} /></div><div className="lightbox-bottom"><div><p className="eyebrow">{large.category}</p><p>{large.title}</p></div>{items.length > 1 && <div className="lightbox-navigation"><button onClick={() => move(-1)} aria-label="Immagine precedente">←</button><span>{(expanded ?? 0) + 1} / {items.length}</span><button onClick={() => move(1)} aria-label="Immagine successiva">→</button></div>}</div></>}
      </dialog>
    </section>
  );
}
