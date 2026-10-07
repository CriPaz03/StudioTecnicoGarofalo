"use client";
import Image from "next/image";
import { flushSync } from "react-dom";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import { projects, projectGroups } from "@/lib/site";
import {MoveUpRight} from "lucide-react";

import { galleryCells } from "@/lib/gallery-layout.mjs";
import LightboxPhoto, { rememberPreview, warmPhoto } from "./LightboxPhoto";

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
      {filter === index && <GalleryContent items={items} fixed={item.id === "modelli"} />}
    </div>)}
  </section>;
}

function GalleryContent({ items, fixed = false }: { items: readonly (typeof projects)[number][]; fixed?: boolean }) {
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
  // Native two-axis scrolling provides touch momentum without a JS drag loop.
  const origin = useRef({ x: 0, y: 0 });
  // The server-rendered collage starts inside the visible viewport. Move it
  // to the middle of the scroll area only once the browser can initialize it.
  const [renderOrigin, setRenderOrigin] = useState({ x: 20000, y: 20000 });
  const initialized = useRef(false);
  const camera = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestedWindow = useRef("0:0");
  const centre = 20000;
  const pan = (x: number, y: number) => {
    const el = viewport.current;
    if (!el) return;
    camera.current = { x, y };
    el.scrollLeft = x - origin.current.x + centre;
    el.scrollTop = y - origin.current.y + centre;
  };
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const sync = () => {
      frame.current = 0;
      const x = el.scrollLeft - centre + origin.current.x;
      const y = el.scrollTop - centre + origin.current.y;
      camera.current = { x, y };
      const scale = el.clientWidth < 600 ? 0.62 : 1;
      const column = Math.floor(x / (490 * scale));
      const row = Math.floor(y / (370 * scale));
      const key = `${column}:${row}`;
      if (requestedWindow.current !== key) {
        requestedWindow.current = key;
        setView(previous => ({ ...previous, x: column * 490 * scale, y: row * 370 * scale }));
      }
    };
    const recenter = () => {
      if (drag.current.active) return;
      if (el.scrollLeft > 5000 && el.scrollLeft < 35000 && el.scrollTop > 5000 && el.scrollTop < 35000) return;
      sync();
      origin.current = { ...camera.current };
      // Reposition cells and scroll origin together, after native momentum ends.
      flushSync(() => setRenderOrigin({ ...origin.current }));
      el.scrollLeft = centre;
      el.scrollTop = centre;
    };
    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(sync);
      if (settle.current) clearTimeout(settle.current);
      settle.current = setTimeout(recenter, 250);
    };
    const observer = new ResizeObserver(() => {
      if (!initialized.current) {
        initialized.current = true;
        flushSync(() => {
          setRenderOrigin({ x: 0, y: 0 });
          setView(previous => ({ ...previous, width: el.clientWidth, height: el.clientHeight }));
        });
        el.scrollLeft = centre;
        el.scrollTop = centre;
        return;
      }
      setView(previous => ({ ...previous, width: el.clientWidth, height: el.clientHeight }));
    });
    observer.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", recenter);
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", recenter);
      cancelAnimationFrame(frame.current);
      if (settle.current) clearTimeout(settle.current);
    };
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
    rememberPreview(items[i], target);
    setSelected(i);
    dialog.current?.showModal();
  };
  const move = (amount: number) =>
    setSelected((i) =>
      i === null ? null : (i + amount + items.length) % items.length,
    );
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
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
    if (e.pointerType !== "mouse") return;
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
      {fixed ? <>
        <div className="gallery-static-grid section">
          {items.map((photo, index) => <figure className="gallery-static-card" key={photo.image}>
            <button
              className="gallery-static-photo"
              onPointerEnter={e => { if (e.pointerType === "mouse") warmPhoto(photo); }}
              onFocus={() => warmPhoto(photo)}
              onClick={e => show(index, e.currentTarget)}
              aria-label={`Ingrandisci: ${photo.alt}`}
            >
              <Image src={`/images/${photo.image}.webp`} alt={photo.alt} fill
                sizes="(max-width: 1000px) 45vw, 23vw" />
              <span className="gallery-static-expand" aria-hidden="true"><MoveUpRight /></span>
            </button>
            <figcaption><span>{photo.title}</span><span>{String(index + 1).padStart(2, "0")}</span></figcaption>
          </figure>)}
        </div>
        <div className="gallery-footnote section">
          <span>{items.length} SPACCATI</span>
          <span>Seleziona un’immagine per ingrandirla.</span>
        </div>
      </> : <>
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
          onTouchStart={e => {
            drag.current.moved = false;
            drag.current.x = e.touches[0].clientX;
            drag.current.y = e.touches[0].clientY;
          }}
          onTouchMove={e => {
            const touch = e.touches[0];
            if (touch && Math.hypot(touch.clientX - drag.current.x, touch.clientY - drag.current.y) > 8) drag.current.moved = true;
          }}
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
                  onPointerEnter={e => { if (e.pointerType === "mouse" && !drag.current.active) warmPhoto(p); }}
                  onFocus={() => warmPhoto(p)}
                  style={{ left: left + view.x - renderOrigin.x + centre, top: top + view.y - renderOrigin.y + centre, width, height }}
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
        <button className="gallery-browse" onClick={e => { drag.current.moved = false; show(0, e.currentTarget); }}>Sfoglia {items.length === 1 ? "la foto" : `le ${items.length} foto`}</button>
        <span>INTERNI · RESIDENZIALE · VISUALIZZAZIONE</span>
        <span>{items.length} VISIONI, UN APPROCCIO.</span>
      </div>
      </>}
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
            <LightboxPhoto key={project.image} photo={project}
              previous={items[((selected ?? 0) - 1 + items.length) % items.length]}
              next={items[((selected ?? 0) + 1) % items.length]} />
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
