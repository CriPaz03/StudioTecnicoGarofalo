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
  const [frame, setFrame] = useState(0);
  const [allowMotion, setAllowMotion] = useState(false);
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
    const mobile = window.matchMedia("(max-width: 700px), (pointer: coarse)");
    let setupVersion = 0;
    const updateProgress = (progress: number) => {
      target = Math.max(0, Math.min(1, progress));
      setStage(target < 0.2 ? 0 : target < 0.68 ? 1 : target < 0.81 ? 2 : target < 0.94 ? 3 : 4);
      progressBar.current?.style.setProperty("--progress", String(target));
    };
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
      const version = ++setupVersion;
      cleanup();
      cleanup = () => {};
      cancelAnimationFrame(raf);
      raf = 0;
      if (motion.matches && !allowMotion) {
        root.dataset.static = "true";
        delete root.dataset.enhanced;
        delete root.dataset.frames;
        if (media.getAttribute("src")) {
          media.removeAttribute("src");
          media.load();
        }
        return;
      }
      delete root.dataset.static;
      if (allowMotion) root.dataset.motionOverride = "true";
      else delete root.dataset.motionOverride;
      // Touch devices use native scroll and still frames. No media seek or
      // asynchronously loaded animation library is needed to activate them.
      if (mobile.matches) {
        root.dataset.enhanced = "true";
        root.dataset.frames = "true";
        setFailed(false);
        if (media.getAttribute("src")) {
          media.removeAttribute("src");
          media.load();
        }
        const sticky = root.querySelector<HTMLElement>(".story-sticky");
        let scrollFrame = 0;
        const update = () => {
          scrollFrame = 0;
          const range = root.offsetHeight - (sticky?.offsetHeight ?? window.innerHeight);
          updateProgress(range > 0 ? -root.getBoundingClientRect().top / range : 0);
          setFrame(Math.min(59, Math.floor(target * 60)));
        };
        const schedule = () => {
          if (!scrollFrame) scrollFrame = requestAnimationFrame(update);
        };
        const resize = new ResizeObserver(schedule);
        resize.observe(root);
        if (sticky) resize.observe(sticky);
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        window.visualViewport?.addEventListener("resize", schedule);
        update();
        cleanup = () => {
          cancelAnimationFrame(scrollFrame);
          resize.disconnect();
          window.removeEventListener("scroll", schedule);
          window.removeEventListener("resize", schedule);
          window.visualViewport?.removeEventListener("resize", schedule);
        };
        return;
      }
      delete root.dataset.frames;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || version !== setupVersion || (motion.matches && !allowMotion)) return;
      root.dataset.enhanced = "true";
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            updateProgress(self.progress);
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
            if (!mobile.matches && !media.getAttribute("src")) {
              media.src = "/video/idea-to-reality.mp4";
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
    mobile.addEventListener("change", setup);
    return () => {
      disposed = true;
      cleanup();
      cancelAnimationFrame(raf);
      media.removeEventListener("loadedmetadata", queue);
      media.removeEventListener("seeked", queue);
      motion.removeEventListener("change", setup);
      mobile.removeEventListener("change", setup);
    };
  }, [allowMotion]);
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
          <a className="flex" href="#servizi">Salta</a>
        </div>
        <div className="story-media">
          <Image
            src="/images/living.webp"
            alt="Render finale del soggiorno, con arredi e illuminazione"
            fill
            sizes="100vw"
            className="story-static-image"
          />
          <Image
            src={`/video/idea-frames/${String(frame + 1).padStart(2, "0")}.webp`}
            alt=""
            fill
            sizes="(max-width: 700px) 100vw, 1px"
            unoptimized
            loading="eager"
            className="story-frame"
            aria-hidden="true"
          />
          <video
            ref={video}
            muted
            playsInline
            preload="none"
            poster="/video/blueprint.webp"
            aria-hidden="true"
            onError={() => {
              // An unused video must never hide the mobile frame sequence.
              if (!section.current?.hasAttribute("data-frames")) setFailed(true);
            }}
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
            {!allowMotion && <button className="story-opt-in" onClick={() => setAllowMotion(true)}>Esplora le fasi con lo scroll</button>}
          </div>
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
