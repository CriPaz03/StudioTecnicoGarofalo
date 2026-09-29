"use client";
import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import { projects, projectGroups } from "@/lib/site";
import {MoveUpRight} from "lucide-react";

import { galleryCells } from "@/lib/gallery-layout.mjs";

const filters = [{ id: "tutte", label: "Tutte", categories: [] as string[] }, ...projectGroups];

export default function ImmersiveGallery() {
  const [filter, setFilter] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = filter === 0 ? projects : projects.filter(p => filters[filter].categories.includes(p.category));
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = { ArrowRight: (index + 1) % filters.length, ArrowLeft: (index + filters.length - 1) % filters.length, Home: 0, End: filters.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    setFilter(keys[event.key]);
    tabs.current[keys[event.key]]?.focus({ preventScroll: true });
  };
  return <section className="gallery-section" aria-labelledby="gallery-title">
    <div className="gallery-heading section">
      <div><p className="eyebrow">03 / ESPLORA I NOSTRI SPAZI</p><h2 id="gallery-title">Prospettive da <em>abitare.</em></h2></div>
      <p>Ogni immagine, una scelta progettuale.<br />Trova il tuo punto di vista.</p>
    </div>
    <div className="gallery-filter-wrap section" id="progetti">
      <div className="gallery-tabs" role="tablist" aria-label="Categorie della gallery">
        {filters.map((item, index) => <button key={item.id} ref={node => { tabs.current[index] = node; }} role="tab" id={`gallery-tab-${item.id}`} aria-controls={`gallery-panel-${item.id}`} aria-selected={filter === index} tabIndex={filter === index ? 0 : -1} onClick={() => setFilter(index)} onKeyDown={event => onTabKey(event, index)}>{item.label}</button>)}
      </div>
    </div>
    {filters.map((item, index) => <div key={item.id} role="tabpanel" id={`gallery-panel-${item.id}`} aria-labelledby={`gallery-tab-${item.id}`} hidden={filter !== index}>
      {filter === index && <GalleryContent items={items} />}
    </div>)}
  </section>;
}

function GalleryContent({ items }: { items: readonly (typeof projects)[number][] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const drag = useRef({
    active: false,
    pointerId: -1,
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    moved: false,
  });
  const [selected, setSelected] = useState<number | null>(null);
  const isOpen = selected !== null;
  const [dragging, setDragging] = useState(false);
  const [view, setView] = useState({ x: 0, y: 0, width: 1440, height: 800 });
  const committedView = useRef(view);
  const requestedWindow = useRef("0:0");
  const camera = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const pan = (x: number, y: number) => {
    camera.current = { x, y };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const { x, y } = camera.current;
      const current = committedView.current;
      if (canvas.current) canvas.current.style.transform = `translate3d(${current.x - x}px, ${current.y - y}px, 0)`;
      const scale = current.width < 600 ? 0.62 : 1;
      const column = Math.floor(x / (490 * scale));
      const row = Math.floor(y / (370 * scale));
      const key = `${column}:${row}`;
      if (requestedWindow.current !== key) {
        requestedWindow.current = key;
        setView(previous => ({ ...previous, x: column * 490 * scale, y: row * 370 * scale }));
      }
    });
  };
  useLayoutEffect(() => {
    committedView.current = view;
    if (canvas.current) canvas.current.style.transform = `translate3d(${view.x - camera.current.x}px, ${view.y - camera.current.y}px, 0)`;
  }, [view]);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setView(previous => ({ ...previous, width: entry.contentRect.width, height: entry.contentRect.height }));
    });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame.current); };
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    const fallback = viewport.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      (opener.current?.isConnected ? opener.current : fallback)?.focus({ preventScroll: true });
    };
  }, [isOpen]);
  const close = () => {
    dialog.current?.close();
    setSelected(null);
  };
  const show = (i: number, target: HTMLElement) => {
    if (drag.current.moved) return;
    opener.current = target;
    setSelected(i);
    dialog.current?.showModal();
  };
  const move = (amount: number) =>
    setSelected((i) =>
      i === null ? null : (i + amount + items.length) % items.length,
    );
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current.moved = false;
    if (!e.isPrimary || e.button !== 0) return;
    drag.current = {
      active: true,
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      left: camera.current.x,
      top: camera.current.y,
      moved: false,
    };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.x,
      dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) > 6) {
      d.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (d.moved) {
      pan(d.left - dx, d.top - dy);
    }
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current.pointerId !== e.pointerId) return;
    drag.current.active = false;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const movements: Record<string, [number, number]> = {
      ArrowLeft: [-180, 0],
      ArrowRight: [180, 0],
      ArrowUp: [0, -180],
      ArrowDown: [0, 180],
    };
    const delta = movements[e.key];
    if (delta) {
      e.preventDefault();
      pan(camera.current.x + delta[0], camera.current.y + delta[1]);
    }
  };
  const project = selected === null ? null : items[selected];
  return (
    <>
      <div className="gallery-shell">
        <div
          ref={viewport}
          className={`gallery-viewport ${dragging ? "dragging" : ""}`}
          tabIndex={0}
          role="region"
          aria-label="Tavola dei progetti esplorabile"
          aria-describedby="gallery-instructions gallery-keyboard"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onLostPointerCapture={onUp}
          onPointerLeave={(e) => {
            if (!drag.current.moved) onUp(e);
          }}
          onKeyDown={onKey}
        >
          <div ref={canvas} className="gallery-canvas">
            {galleryCells(view, items.length).map(({ key, index: i, left, top, width, height }) => {
              const p = items[i];
              return (
                <button
                  className="gallery-item"
                  key={`${key}:${p.image}`}
                  tabIndex={-1}
                  style={{ left, top, width, height }}
                  onClick={(e) => {
                    if (e.detail === 0) drag.current.moved = false;
                    show(i, e.currentTarget);
                  }}
                  aria-label={`Apri immagine: ${p.alt}`}
                >
                  <Image
                    src={`/images/${p.image}.webp`}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 600px) 280px, 440px"
                    draggable={false}
                  />
                  <span className="gallery-item-label">
                    {p.category}
                    <span aria-hidden="true"><MoveUpRight /></span>
                  </span>
                </button>
              );
            })}

          </div>
        </div>
        <div className="gallery-hint" id="gallery-instructions">
          <span aria-hidden="true">✥</span> Esplora in ogni direzione{" "}
          <span className="hint-divider" /> Tocca per scoprire
        </div>
        <a className="gallery-exit" href="#video-progetto">
          Continua
        </a>
      </div>
      <p id="gallery-keyboard" className="sr-only">Usa le frecce per muovere la tavola. Per aprire le immagini con la tastiera, scegli Sfoglia tutte le foto. Scorri fuori dalla tavola o scegli Continua il percorso per proseguire.</p>
      <div className="gallery-footnote section">
        <button className="gallery-browse" onClick={e => { drag.current.moved = false; show(0, e.currentTarget); }}>Sfoglia {items.length === 1 ? "la foto" : `le ${items.length} foto`} ↗</button>
        <span>INTERNI · RESIDENZIALE · VISUALIZZAZIONE</span>
        <span>{items.length} VISIONI, UN APPROCCIO.</span>
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Dettaglio progetto"
        onCancel={close}
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(-1);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            move(1);
          }
        }}
      >
        <button
          className="lightbox-close"
          onClick={close}
          aria-label="Chiudi immagine"
        >
          ✕
        </button>
        {project && (
          <>
            <div className="lightbox-image">
              <Image
                src={`/images/${project.image}.webp`}
                alt={project.alt}
                fill
                sizes="95vw"
                quality={85}
              />
            </div>
            <div className="lightbox-bottom">
              <div>
                <p className="eyebrow">{project.category}</p>
                <p>{project.title}</p>
              </div>
              <div className="lightbox-navigation">
                <button
                  onClick={() => move(-1)}
                  aria-label="Immagine precedente"
                >
                  ←
                </button>
                <span>
                  {String((selected ?? 0) + 1).padStart(2, "0")} /{" "}
                  {items.length}
                </span>
                <button
                  onClick={() => move(1)}
                  aria-label="Immagine successiva"
                >
                  →
                </button>
              </div>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
