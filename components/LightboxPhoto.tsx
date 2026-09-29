"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useState } from "react";

type Photo = { image: string; alt: string };
const previews = new Map<string, string>();
const pending = new Map<string, HTMLImageElement>();
const photoProps = (photo: Photo) => ({
  src: `/images/${photo.image}.webp`, alt: photo.alt, fill: true,
  sizes: "95vw", quality: 85,
});

export function rememberPreview(photo: Photo, target: HTMLElement) {
  const image = target.querySelector("img");
  if (image?.complete && image.naturalWidth) previews.set(photo.image, image.currentSrc);
}

// Reuse exactly the same responsive source selection as the displayed image.
export function warmPhoto(photo: Photo) {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (connection?.saveData || connection?.effectiveType?.includes("2g")) return;
  const { props } = getImageProps(photoProps(photo));
  const key = `${photo.image}:${window.innerWidth}:${window.devicePixelRatio}`;
  if (pending.has(key)) return;
  const image = new window.Image();
  image.decoding = "async";
  image.fetchPriority = "low";
  image.sizes = props.sizes ?? "95vw";
  image.srcset = props.srcSet ?? "";
  image.src = props.src;
  image.onerror = () => pending.delete(key);
  pending.set(key, image);
  if (pending.size > 32) pending.delete(pending.keys().next().value!);
}

export default function LightboxPhoto({ photo, previous, next }: { photo: Photo; previous: Photo; next: Photo }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    warmPhoto(previous);
    warmPhoto(next);
  }, [previous, next]);
  return <div className="lightbox-image" aria-busy={!loaded && !failed}>
    <Image src={previews.get(photo.image) || `/responsive/${photo.image}-384.webp`} alt="" fill unoptimized loading="eager" aria-hidden="true" />
    <Image {...photoProps(photo)} alt={photo.alt} loading="eager" fetchPriority="high"
      style={{ opacity: loaded ? 1 : 0 }}
      onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
    {failed && <span className="sr-only" role="status">Versione ad alta risoluzione non disponibile. È mostrata l’anteprima.</span>}
  </div>;
}
