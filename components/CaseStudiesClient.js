"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { projects as fallbackProjects } from "@/lib/data";
import { useSiteContent } from "@/components/useSiteContent";
import { FinalCta } from "@/components/Sections";
import { Reveal } from "@/components/Motion";

export default function CaseStudiesClient() {
  const [content] = useSiteContent();
  const projectItems = content.projects?.length ? content.projects : fallbackProjects;

  return (
    <>
      <section className="section case-list">
        {projectItems.map((project, index) => (
          <Reveal className="case-study glass" delay={index * 0.03} id={project.name.toLowerCase().replaceAll(" ", "-")} key={project.name}>
            <div>
              <span className="eyebrow">{project.industry}</span>
              <h2>{project.name}</h2>
              <p><b>Challenge:</b> Build a stronger digital presence with clearer visual communication and more consistent customer engagement.</p>
              <p><b>Solution:</b> Zee Brows planned the creative direction, produced campaign-ready assets, and aligned content with business growth goals.</p>
              <p><b>Creative Direction:</b> Premium, clear, audience-focused content designed for digital platforms and campaign performance.</p>
              <p><b>Results:</b> {project.result}</p>
              <p><CheckCircle2 size={17} /> <b>Services Provided:</b> {project.service}</p>
            </div>
            <div className="case-image">
              <Image src={project.image || "/assets/portfolio-contact.png"} alt={`${project.name} case study images`} fill sizes="360px" />
            </div>
          </Reveal>
        ))}
      </section>
      <FinalCta />
    </>
  );
}
