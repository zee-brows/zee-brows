import Image from "next/image";
import { Reveal } from "@/components/Motion";
import CaseStudiesClient from "@/components/CaseStudiesClient";

export default function CaseStudiesPage() {
  return (
    <main>
      <section className="page-hero compact">
        <Image src="/assets/portfolio-contact.png" alt="Zee Brows case study gallery" fill priority sizes="100vw" />
        <Reveal>
          <span className="eyebrow">Case Studies</span>
          <h1>Strategy, Creative Direction, and Results</h1>
        </Reveal>
      </section>
      <CaseStudiesClient />
    </main>
  );
}
