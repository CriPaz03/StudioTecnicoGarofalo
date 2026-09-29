"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useRef, useState } from "react";

export default function ProjectFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);

  const play = async () => {
    const player = video.current;
    if (!player) return;
    setError(false);
    setStarted(true);
    // Assign the source only after an explicit click: no video download on page load.
    if (!player.getAttribute("src")) player.src = "/video/ville.mp4";
    player.controls = true;
    player.focus({ preventScroll: true });
    try {
      await player.play();
    } catch {
      setError(true);
      setStarted(false);
    }
  };

  return (
    <section className="project-film section" id="video-progetto" aria-labelledby="film-title">
      <div className="project-film-heading">
        <div>
          <p className="eyebrow">IL PROGETTO IN MOVIMENTO</p>
          <h2 id="film-title">Un altro <em>punto di vista.</em></h2>
        </div>
        <p>Volumi, proporzioni e relazioni tra gli spazi, in un percorso attraverso il progetto.</p>
      </div>
      <div className="project-film-player">
        <video
          ref={video}
          playsInline
          preload="none"
          controls={started}
          tabIndex={started ? 0 : -1}
          aria-label="Video del progetto residenziale: esterni, terrazze e interni"
          aria-describedby="film-description"
          onError={() => { setError(true); setStarted(false); }}
        />
        {!started && (
          <button className="project-film-cover" onClick={play} aria-label={error ? "Riprova a riprodurre il video del progetto" : "Guarda il progetto — video di 29 secondi"}>
            <Image src="/images/ville-poster.webp" alt="Vista del progetto residenziale con facciate contemporanee e balconi" fill sizes="(max-width: 700px) 92vw, 90vw" />
            <span className="project-film-play"><span className="project-film-play-icon"><Play aria-hidden="true" /></span>{error ? "Riprova" : "Guarda il progetto"}</span>
            <span className="project-film-duration">FILM DI PROGETTO / 00:29</span>
          </button>
        )}
      </div>
      {error && <p role="alert" className="project-film-error">Il video non è partito. Riprova oppure <a href="/video/ville.mp4">apri il filmato direttamente</a>.</p>}
      <p id="film-description" className="project-film-caption">Dalle facciate agli ambienti interni: una sequenza di viste del progetto residenziale. Video senza audio.</p>
    </section>
  );
}
