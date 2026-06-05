import Image from "next/image";
import { FinalCta } from "@/components/Sections";
import { Reveal } from "@/components/Motion";

const blocks = [
  ["About Zee Brows", "Zee Brows is a modern digital growth agency built for brands that need strategy, style, and execution in one place."],
  ["Our Story", "Born from the intersection of travel, technology, and media, Zee Brows helps businesses look sharper, communicate better, and grow with confidence."],
  ["Mission", "Our mission is to help brands grow with smart strategy, creative digital solutions, and results-focused marketing. We create visuals, campaigns, and digital experiences that connect, inspire, and move businesses forward."],
  ["Vision", "Our vision is to become a trusted digital growth partner for businesses seeking innovation, impact, and long-term success."],
  ["What Makes Us Unique", "We connect strategic planning, premium creative direction, paid media execution, modern websites, and content production into one growth engine."],
  ["Our Creative Process", "Every project moves from discovery to strategy, design, campaign execution, optimization, and clear reporting."]
];

const steps = [
  "Insight-Driven Planning",
  "Custom Strategy Design",
  "Creative Excellence",
  "Performance-Focused Execution",
  "Smart Technology Integration",
  "Continuous Optimization"
];

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero compact">
        <Image src="/assets/about.png" alt="Zee Brows agency workspace" fill priority sizes="100vw" />
        <Reveal>
          <span className="eyebrow">About Us</span>
          <h1>Strategy, Creativity, and Technology Moving Together</h1>
        </Reveal>
      </section>
      <section className="section">
        <div className="story-grid">
          {blocks.map(([title, text], index) => (
            <Reveal className="glass text-card" delay={index * 0.04} key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section">
        <Reveal className="section-head">
          <span className="eyebrow">Our Strategy</span>
          <h2>A Clear Growth Process</h2>
        </Reveal>
        <div className="process">
          {steps.map((step, index) => (
            <Reveal className="process-step" delay={index * 0.04} key={step}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>{step}</span>
            </Reveal>
          ))}
        </div>
      </section>
      <FinalCta />
    </main>
  );
}
