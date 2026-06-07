"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Target } from "lucide-react";
import { extraServices, industries, metrics, projects, services } from "@/lib/data";
import { Reveal } from "@/components/Motion";
import { useSiteContent } from "@/components/useSiteContent";

export function Hero() {
  return (
    <section className="hero">
      <Image src="/assets/hero.png" alt="Cinematic digital marketing dashboards for Zee Brows" fill priority sizes="100vw" />
      <div className="hero-video" aria-hidden="true" />
      <div className="hero-content">
        <Reveal>
          <div className="eyebrow">Digital Media & Marketing Solutions Agency</div>
          <h1>Creative Digital Marketing That Builds Brands, Drives Leads & Grows Businesses</h1>
          <p>
            Zee Brows combines strategy, creative design, social media, paid advertising, websites, branding, and video
            production to help businesses grow with confidence.
          </p>
          <div className="actions">
            <Link className="btn" href="/contact">Get Free Consultation <ArrowUpRight size={18} /></Link>
            <Link className="btn btn-ghost" href="/portfolio">View Our Work</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ImageText({ eyebrow, title, text, image, reverse = false }) {
  return (
    <section className={`section split ${reverse ? "reverse" : ""}`}>
      <Reveal className="copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </Reveal>
      <Reveal className="visual">
        <Image src={image} alt={title} fill sizes="(max-width: 900px) 100vw, 48vw" />
      </Reveal>
    </section>
  );
}

export function ServiceGrid({ showAll = true }) {
  const [content] = useSiteContent();
  const publicServices = content.services?.length
    ? content.services.map((item) => ({ ...item, icon: services.find((service) => service.slug === item.slug)?.icon || Target }))
    : services;
  const cards = showAll ? [...publicServices, ...extraServices] : [...publicServices, ...extraServices.slice(0, 2)];
  return (
    <section className="section">
      <Reveal className="section-head">
        <span className="eyebrow">Services</span>
        <h2>Digital Services Built for Business Growth</h2>
        <p>
          Each service is planned to work with the others: content that supports ads, websites that convert traffic, branding that sharpens trust,
          and reporting that makes the next move obvious.
        </p>
      </Reveal>
      <div className="card-grid">
        {cards.map((item, index) => {
          const Icon = item.icon;
          const href = item.slug ? `/services/${item.slug}` : "/services";
          return (
            <Reveal className="service-card glass" delay={index * 0.025} key={item.title}>
              <div className="icon-3d"><Icon size={28} /></div>
              <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.short || item.text}</p>
              <Link href={href}>Learn More <ArrowUpRight size={15} /></Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function WhyChoose() {
  const points = [
    "Insight-driven strategy",
    "High-end creative execution",
    "Performance-focused campaigns",
    "Smart technology integration",
    "Continuous optimization",
    "Premium visual content"
  ];
  return (
    <section className="section split reverse">
      <Reveal className="visual">
        <Image src="/assets/services.png" alt="Futuristic growth dashboard" fill sizes="(max-width: 900px) 100vw, 48vw" />
      </Reveal>
      <Reveal className="copy">
        <span className="eyebrow">Why Zee Brows</span>
        <h2>Why Brands Choose Zee Brows</h2>
        <div className="check-list">
          {points.map((point) => (
            <p key={point}><CheckCircle2 size={18} /> {point}</p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function Industries() {
  return (
    <section className="section">
      <Reveal className="section-head">
        <span className="eyebrow">Industries</span>
        <h2>Growth Strategy for Local and International Markets</h2>
      </Reveal>
      <div className="industry-grid">
        {industries.map((industry, index) => (
          <Reveal className="industry-card" delay={index * 0.025} key={industry}>
            <Image src={index % 2 ? "/assets/about.png" : "/assets/portfolio-contact.png"} alt={`${industry} digital marketing visual`} fill sizes="220px" />
            <span>{industry}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Metrics() {
  const [content] = useSiteContent();
  const metricItems = content.metrics?.length ? content.metrics.map((item) => [item.number, item.label]) : metrics;

  return (
    <section className="metrics">
      {metricItems.map(([number, label]) => (
        <Reveal className="metric" key={label}>
          <strong>{number}</strong>
          <span>{label}</span>
        </Reveal>
      ))}
    </section>
  );
}

export function PortfolioPreview() {
  return (
    <section className="section portfolio-preview-section">
      <Reveal className="section-head">
        <span className="eyebrow">Portfolio</span>
        <h2>Work shaped for screens, campaigns, and customers in motion.</h2>
        <p>
          Preview selected campaign systems, brand visuals, website interfaces, and social-first assets. Client names stay inside the full
          portfolio, while the homepage keeps the focus on craft and presentation.
        </p>
      </Reveal>
      <div className="portfolio-strip">
        {[1, 2, 3].map((item) => (
          <Reveal className="portfolio-mock" delay={item * 0.05} key={item}>
            <Image src="/assets/portfolio-contact.png" alt="Zee Brows project mockup preview" fill sizes="33vw" />
          </Reveal>
        ))}
      </div>
      <Reveal className="center-action">
        <Link className="btn" href="/portfolio">View Portfolio <ArrowUpRight size={18} /></Link>
      </Reveal>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="final-cta">
      <Reveal>
        <h2>Ready to make your digital presence feel unmistakably yours?</h2>
        <p>Bring Zee Brows your brand, offer, or campaign goal. We&apos;ll shape the strategy, visuals, launch plan, and optimization rhythm around it.</p>
        <Link className="btn" href="/contact">Start Your Project <ArrowUpRight size={18} /></Link>
      </Reveal>
    </section>
  );
}

export function ProjectGrid() {
  const [content] = useSiteContent();
  const projectItems = content.projects?.length ? content.projects : projects;

  return (
    <div className="project-grid">
      {projectItems.map((project, index) => (
        <Reveal className="project-card glass" delay={index * 0.04} key={project.name}>
          <div className="project-image">
            <Image src={project.image || "/assets/portfolio-contact.png"} alt={`${project.name} portfolio mockup`} fill sizes="360px" />
          </div>
          <span>{project.industry}</span>
          <h3>{project.name}</h3>
          <p>{project.service}</p>
          <p>{project.result}</p>
          <Link href={`/case-studies#${project.name.toLowerCase().replaceAll(" ", "-")}`}>View Case Study <ArrowUpRight size={15} /></Link>
        </Reveal>
      ))}
    </div>
  );
}
