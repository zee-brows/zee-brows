import Image from "next/image";
import { ProjectGrid, FinalCta } from "@/components/Sections";
import { Reveal } from "@/components/Motion";

const categories = [
  "Social Media Campaigns",
  "Branding Projects",
  "Website Projects",
  "Video Projects",
  "Advertising Campaigns",
  "International Projects"
];

export default function PortfolioPage() {
  return (
    <main>
      <section className="page-hero compact">
        <Image src="/assets/portfolio-contact.png" alt="Zee Brows portfolio gallery" fill priority sizes="100vw" />
        <Reveal>
          <span className="eyebrow">Portfolio / Our Work</span>
          <h1>Brands & Projects We&apos;ve Helped Grow</h1>
          <p>Client names and project details appear here, while homepage previews remain mockup-only.</p>
        </Reveal>
      </section>
      <section className="section">
        <div className="chips">
          {categories.map((category) => <span key={category}>{category}</span>)}
        </div>
        <ProjectGrid />
      </section>
      <FinalCta />
    </main>
  );
}
