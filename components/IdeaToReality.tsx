"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { stages } from "@/lib/site";
import {MoveDown} from "lucide-react";

export default function IdeaToReality() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const root = section.current,
      media = video.current;
    if (!root || !media) return;
    let disposed = false,
      raf = 0,
      target = 0,
      active = false;
    let cleanup = () => {};
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seek = () => {
      raf = 0;
      if (!active || media.seeking || !Number.isFinite(media.duration)) return;
      const time = Math.min(
        target * media.duration,
        Math.max(0, media.duration - 0.04),
      );
      if (Math.abs(media.currentTime - time) > 0.025) media.currentTime = time;
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(seek);
    };
    const setup = async () => {
      cleanup();
      cancelAnimationFrame(raf);
      raf = 0;
      if (motion.matches) {
        root.dataset.static = "true";
        delete root.dataset.enhanced;
        media.removeAttribute("src");
        media.load();
        return;
      }
      delete root.dataset.static;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || motion.matches) return;
      root.dataset.enhanced = "true";
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            target = self.progress;
            setStage(
              target < 0.2
                ? 0
                : target < 0.68
                  ? 1
                  : target < 0.81
                    ? 2
                    : target < 0.94
                      ? 3
                      : 4,
            );
            progressBar.current?.style.setProperty(
              "--progress",
              String(target),
            );
            active = self.isActive || target === 1 || target === 0;
            queue();
          },
          onToggle: (self) => {
            active = self.isActive;
            if (active) queue();
          },
        });
      }, root);
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            if (!media.getAttribute("src")) {
              media.src = window.matchMedia("(max-width: 700px)").matches
                ? "/video/idea-to-reality-mobile.mp4"
                : "/video/idea-to-reality.mp4";
              media.load();
            }
            observer.disconnect();
          }
        },
        { rootMargin: "500px" },
      );
      observer.observe(root);
      cleanup = () => {
        observer.disconnect();
        context.revert();
      };
    };
    media.addEventListener("loadedmetadata", queue);
    media.addEventListener("seeked", queue);
    void setup();
    motion.addEventListener("change", setup);
    return () => {
      disposed = true;
      cleanup();
      cancelAnimationFrame(raf);
      media.removeEventListener("loadedmetadata", queue);
      media.removeEventListener("seeked", queue);
      motion.removeEventListener("change", setup);
    };
  }, []);
  return (
    <section
      ref={section}
      className={`story ${failed ? "story-failed" : ""}`}
      id="dall-idea-alla-realta"
      aria-label="Dall’idea alla realtà, il progetto prende forma"
    >
      <div className="story-sticky">
        <div className="story-top">
          <p className="eyebrow">01 / DALL’IDEA ALLA REALTÀ</p>
          <a href="#studio">Salta l’esperienza <MoveDown /></a>
        </div>
        <div className="story-media">
          <Image
            src="/images/living.webp"
            alt="Render finale del soggiorno, con arredi e illuminazione"
            fill
            sizes="100vw"
            className="story-static-image"
          />
          <video
            ref={video}
            muted
            playsInline
            preload="none"
            poster="/video/blueprint.webp"
            aria-hidden="true"
            onError={() => setFailed(true)}
          />
        </div>
        <div className="story-bottom">
          <div className="stage-copy" key={stage}>
            <p className="eyebrow">
              0{stage + 1} - {stages[stage].name}
            </p>
            <h2>{stages[stage].title}</h2>
            <p>{stages[stage].text}</p>
          </div>
          <div className="story-static-copy">
            <p className="eyebrow">DAL PROGETTO ALLA VISUALIZZAZIONE</p>
            <h2>Dall’idea alla realtà.</h2>
            <p>
              Disegno, modellazione, materiali, arredi e luce: ogni fase dà
              forma allo spazio.
            </p>
          </div>
          <span className="story-scroll">
            SCORRI PER DARE FORMA <span aria-hidden="true"><MoveDown /></span>
          </span>
        </div>
        <div className="story-timeline" ref={progressBar}>
          <div className="timeline-track" />
          {stages.map((s, i) => (
            <span key={s.name} className={stage === i ? "active" : ""}>
              0{i + 1}
              <small>{s.name}</small>
            </span>
          ))}
        </div>
      </div>
      <div className="sr-only">
        {stages.map((s) => (
          <p key={s.name}>
            {s.name}. {s.title} {s.text}
          </p>
        ))}
      </div>
    </section>
  );
}
