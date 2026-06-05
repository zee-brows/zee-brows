"use client";

import Image from "next/image";
import { CheckCircle2, Code2, Palette, Search, Share2, Target, Video } from "lucide-react";
import { services as fallbackServices } from "@/lib/data";
import { useSiteContent } from "@/components/useSiteContent";
import { FinalCta } from "@/components/Sections";
import { Reveal } from "@/components/Motion";

const iconMap = {
  "social-media-marketing": Share2,
  "google-ads-management": Target,
  "seo-services": Search,
  "website-development": Code2,
  "branding-creative-design": Palette,
  "video-production": Video
};

export default function ServiceDetailClient({ slug }) {
  const [content] = useSiteContent();
  const fallback = fallbackServices.find((item) => item.slug === slug);
  const service = content.services?.find((item) => item.slug === slug) || fallback;
  const Icon = iconMap[slug] || Target;
  const includes = fallback?.includes || [];

  if (!service) return null;

  return (
    <main>
      <section className="page-hero service-detail">
        <Image src={service.visual || fallback?.visual || "/assets/services.png"} alt={`${service.title} visual`} fill priority sizes="100vw" />
        <Reveal>
          <span className="eyebrow">Zee Brows Service</span>
          <div className="hero-icon"><Icon size={34} /></div>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
        </Reveal>
      </section>
      <section className="section split">
        <Reveal className="copy">
          <span className="eyebrow">What We Include</span>
          <h2>Built for Business Growth</h2>
          <p>{service.short}</p>
        </Reveal>
        <Reveal className="glass include-panel">
          {includes.map((item) => (
            <p key={item}><CheckCircle2 size={18} /> {item}</p>
          ))}
        </Reveal>
      </section>
      <FinalCta />
    </main>
  );
}
