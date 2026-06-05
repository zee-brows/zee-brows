import Image from "next/image";
import { ServiceGrid, FinalCta } from "@/components/Sections";
import { Reveal } from "@/components/Motion";

export default function ServicesPage() {
  return (
    <main>
      <section className="page-hero compact">
        <Image src="/assets/services.png" alt="Zee Brows digital growth ecosystem" fill priority sizes="100vw" />
        <Reveal>
          <span className="eyebrow">Services</span>
          <h1>Complete Digital Growth Solutions Under One Creative Agency</h1>
        </Reveal>
      </section>
      <ServiceGrid />
      <FinalCta />
    </main>
  );
}
