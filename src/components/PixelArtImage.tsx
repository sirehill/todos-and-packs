"use client";
import Image from "next/image";

export default function PixelArtImage({
  src, alt, size = 96, rounded = true, className = "",
}: { src: string; alt: string; size?: number; rounded?: boolean; className?: string }) {
  const classes = ["overflow-hidden", rounded ? "rounded-xl" : "", className].filter(Boolean).join(" ");
  return (
    <div
      className={classes}
      style={{ width: size, height: size, imageRendering: "pixelated" as any }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        sizes={`${size}px`}
        quality={100}
        style={{ width: "100%", height: "100%", imageRendering: "pixelated" as any }}
      />
    </div>
  );
}