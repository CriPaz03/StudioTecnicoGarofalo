"use client";
import type { ImageLoaderProps } from "next/image";
export default function imageLoader({ src, width }: ImageLoaderProps) {
  if (!src.startsWith("/images/") || !src.endsWith(".webp")) return src;
  return `/responsive/${src.split("/").pop()?.replace(".webp", "")}-${width}.webp`;
}
