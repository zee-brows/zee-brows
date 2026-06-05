import Image from "next/image";

export function isVideoSource(src = "") {
  return src.startsWith("data:video") || /\.(mp4|webm|ogg)(\?|$)/i.test(src);
}

export function MediaBackground({ src, alt, priority = false }) {
  if (isVideoSource(src)) {
    return (
      <video className="media-fill" autoPlay muted loop playsInline>
        <source src={src} />
      </video>
    );
  }

  return <Image src={src} alt={alt} fill priority={priority} sizes="100vw" />;
}
