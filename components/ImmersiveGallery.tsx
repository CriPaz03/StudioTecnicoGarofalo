"use client";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import { projects } from "@/lib/site";
import {MoveDown, MoveUpRight} from "lucide-react";

// Intentionally irregular photographic board, with physical bounds supplied by native scrolling.
const positions = [
  [70, 75, 480, 315],
  [600, 25, 370, 255],
  [1020, 90, 460, 305],
  [1530, 40, 320, 370],
  [80, 450, 300, 390],
  [440, 355, 540, 350],
  [1040, 460, 320, 425],
  [1430, 475, 420, 280],
  [50, 915, 480, 285],
  [590, 775, 440, 305],
  [1090, 940, 380, 280],
  [1530, 835, 330, 350],
];
export default function ImmersiveGallery() {
  const viewport = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const drag = useRef({
    active: false,
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    moved: false,
  });
  const [selected, setSelected] = useState<number | null>(null);
  const isOpen = selected !== null;
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const el = viewport.current;
    if (el) {
      el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2);
      el.scrollTop = window.innerWidth < 600 ? 120 : 200;
    }
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      opener.current?.focus({ preventScroll: true });
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
      i === null ? null : (i + amount + projects.length) % projects.length,
    );
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current.moved = false;
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    drag.current = {
      active: true,
      x: e.clientX,
      y: e.clientY,
      left: el.scrollLeft,
      top: el.scrollTop,
      moved: false,
    };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.x,
      dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) > 6) {
      d.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (d.moved) {
      e.currentTarget.scrollLeft = d.left - dx;
      e.currentTarget.scrollTop = d.top - dy;
    }
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
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
      e.currentTarget.scrollBy({
        left: delta[0],
        top: delta[1],
        behavior: "auto",
      });
    }
  };
  const project = selected === null ? null : projects[selected];
  return (
    <section
      className="gallery-section"
      id="progetti"
      aria-labelledby="gallery-title"
    >
      <div className="gallery-heading section">
        <div>
          <p className="eyebrow">03 / ESPLORA I NOSTRI SPAZI</p>
          <h2 id="gallery-title">
            Prospettive da <em>abitare.</em>
          </h2>
        </div>
        <p>
          Ogni immagine, una scelta progettuale.
          <br />
          Trova il tuo punto di vista.
        </p>
      </div>
      <div className="gallery-shell">
        <div
          ref={viewport}
          className={`gallery-viewport ${dragging ? "dragging" : ""}`}
          tabIndex={0}
          role="region"
          aria-label="Tavola dei progetti esplorabile"
          aria-describedby="gallery-instructions"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={(e) => {
            if (!drag.current.moved) onUp(e);
          }}
          onKeyDown={onKey}
        >
          <div className="gallery-canvas">
            {projects.map((p, i) => {
              const [left, top, width, height] = positions[i];
              return (
                <button
                  className="gallery-item"
                  key={p.image}
                  style={{
                    left: `calc(${left}px * var(--board-scale))`,
                    top: `calc(${top}px * var(--board-scale))`,
                    width: `calc(${width}px * var(--board-scale))`,
                    height: `calc(${height}px * var(--board-scale))`,
                  }}
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
                    sizes="(max-width: 600px) 350px, 540px"
                    draggable={false}
                  />
                  <span className="gallery-item-label">
                    {p.category}
                    <span aria-hidden="true"><MoveUpRight /></span>
                  </span>
                </button>
              );
            })}
            <span className="board-mark" aria-hidden="true">
              GAROFALO / VISIONI DI PROGETTO
            </span>
          </div>
        </div>
        <div className="gallery-hint" id="gallery-instructions">
          <span aria-hidden="true">✥</span> Trascina per esplorare{" "}
          <span className="hint-divider" /> Tocca per scoprire
        </div>
        <a className="gallery-exit" href="#metodo">
          Continua il percorso <MoveDown />
        </a>
      </div>
      <div className="gallery-footnote section">
        <span>INTERNI · RESIDENZIALE · VISUALIZZAZIONE</span>
        <span>12 VISIONI, UN APPROCCIO.</span>
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
                  {projects.length}
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
    </section>
  );
}
