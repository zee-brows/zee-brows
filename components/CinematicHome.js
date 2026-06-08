"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight, BarChart3, Clapperboard, Code2, Palette, Search, Share2, Target } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { Metrics, PortfolioPreview, FinalCta } from "@/components/Sections";
import { useSiteContent } from "@/components/useSiteContent";
import { defaultContent } from "@/lib/siteContent";
import { MediaBackground } from "@/components/Media";

const HeroLogo3D = dynamic(() => import("@/components/HeroLogo3D"), {
  ssr: false,
  loading: () => <div className="hero-logo-3d hero-logo-loading" aria-hidden="true" />
});

const stageMeta = {
  strategy: { object: "logo", icon: Target },
  social: { object: "social", icon: Share2 },
  ads: { object: "dashboard", icon: Search },
  websites: { object: "web", icon: Code2 },
  branding: { object: "brand", icon: Palette },
  video: { object: "timeline", icon: Clapperboard },
  growth: { object: "ecosystem", icon: BarChart3 }
};

const fallbackStages = [
  {
    key: "strategy",
    kicker: "Stage 01",
    title: "Strategy",
    word: "STRATEGY",
    text: "Insight-led planning shapes the direction before a single post, ad, website, or video goes live.",
    image: "/assets/stage-strategy.png"
  },
  {
    key: "social",
    kicker: "Stage 02",
    title: "Social Media",
    word: "CREATE",
    text: "The brand system opens into content calendars, reels, post grids, stories, and engagement signals.",
    image: "/assets/stage-social.png"
  },
  {
    key: "ads",
    kicker: "Stage 03",
    title: "Google Ads",
    word: "LAUNCH",
    text: "Search intent, conversion tracking, remarketing, and campaign intelligence turn attention into action.",
    image: "/assets/stage-google-ads.png"
  },
  {
    key: "websites",
    kicker: "Stage 04",
    title: "Websites",
    word: "BUILD",
    text: "Campaign energy becomes fast, responsive, conversion-focused websites and landing experiences.",
    image: "/assets/stage-websites.png"
  },
  {
    key: "branding",
    kicker: "Stage 05",
    title: "Branding",
    word: "DESIGN",
    text: "Identity, colors, layouts, visual direction, and creative systems make every touchpoint feel premium.",
    image: "/assets/stage-branding.png"
  },
  {
    key: "video",
    kicker: "Stage 06",
    title: "Video Production",
    word: "EDIT",
    text: "Video timelines, motion graphics, ad creatives, and short-form stories bring the message into motion.",
    image: "/assets/stage-video.png"
  },
  {
    key: "growth",
    kicker: "Stage 07",
    title: "Growth",
    word: "GROW",
    text: "Everything connects into one digital growth ecosystem: strategy, content, ads, websites, branding, and optimization.",
    image: "/assets/stage-growth.png"
  }
];

function ThreeAtmosphere() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 100);
    camera.position.z = 8;

    const geometry = new THREE.BufferGeometry();
    const goldGeometry = new THREE.BufferGeometry();
    const count = 420;
    const goldCount = 150;
    const positions = new Float32Array(count * 3);
    const goldPositions = new Float32Array(goldCount * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    for (let i = 0; i < goldCount; i += 1) {
      goldPositions[i * 3] = (Math.random() - 0.5) * 13;
      goldPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      goldPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    goldGeometry.setAttribute("position", new THREE.BufferAttribute(goldPositions, 3));
    const material = new THREE.PointsMaterial({ color: 0xd10d18, size: 0.035, transparent: true, opacity: 0.75 });
    const goldMaterial = new THREE.PointsMaterial({ color: 0xf7c846, size: 0.028, transparent: true, opacity: 0.62 });
    const points = new THREE.Points(geometry, material);
    const goldPoints = new THREE.Points(goldGeometry, goldMaterial);
    scene.add(points);
    scene.add(goldPoints);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
    };

    let frame = 0;
    const render = () => {
      points.rotation.y += 0.0018;
      points.rotation.x += 0.0006;
      goldPoints.rotation.y -= 0.0012;
      goldPoints.rotation.z += 0.0008;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      goldGeometry.dispose();
      material.dispose();
      goldMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas className="three-atmosphere" ref={canvasRef} aria-hidden="true" />;
}

function MorphObject({ activeStage, stages }) {
  const activeKey = stages[activeStage]?.key || "strategy";
  const active = stageMeta[activeKey]?.object || "logo";

  return (
    <div className={`morph-object cinematic-stage-visual is-${active}`}>
      <div className="morph-glow" />
      <div className="gold-glow" />
      <div className="scene-orbit scene-orbit-one" />
      <div className="scene-orbit scene-orbit-two" />
      <div className="stage-particles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => <span key={index} />)}
      </div>
      {stages.map((stage, index) => (
        <div className={`morph-layer stage-scene ${index === activeStage ? "active" : ""}`} key={stage.key}>
          <Image
            src={stage.image}
            alt={`${stage.title} cinematic 3D Zee Brows visual`}
            fill
            priority={index < 2}
            sizes="(max-width: 900px) 92vw, 58vw"
          />
        </div>
      ))}
    </div>
  );
}

function Loader({ text }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((value) => {
        const next = Math.min(value + Math.ceil(Math.random() * 9), 100);
        if (next >= 100) {
          clearInterval(timer);
          window.setTimeout(() => setDone(true), 450);
        }
        return next;
      });
    }, 85);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`cinema-loader ${done ? "is-done" : ""}`} aria-hidden={done}>
      <Image src="/assets/logo-3d.png" alt="" width={190} height={190} priority />
      <p>{text}</p>
      <strong>{count}%</strong>
      <span><i style={{ width: `${count}%` }} /></span>
    </div>
  );
}

function SplitHeadline({ text }) {
  const words = useMemo(() => (text || "").split(" ").filter(Boolean), [text]);

  return (
    <h1 className="split-headline" aria-label={text}>
      {words.map((word, wordIndex) => (
        <span className="headline-word" key={`${word}-${wordIndex}`}>
          {word.split("").map((letter, letterIndex) => (
            <span
              className="headline-letter"
              style={{ "--letter-delay": `${wordIndex * 0.12 + letterIndex * 0.024}s` }}
              aria-hidden="true"
              key={`${letter}-${letterIndex}`}
            >
              {letter}
            </span>
          ))}
        </span>
      ))}
      <span className="headline-light" aria-hidden="true" />
    </h1>
  );
}

function AgencySignature() {
  const pillars = [
    ["Market clarity", "Audience intent, offer positioning, and channel priorities are mapped before creative production begins."],
    ["Creative systems", "Every post, landing page, ad, and video is shaped from one visual language instead of disconnected assets."],
    ["Performance rhythm", "Campaigns are reviewed, refined, and scaled through measurable weekly learning loops."]
  ];
  const steps = ["Discover", "Position", "Design", "Launch", "Measure", "Scale"];

  return (
    <section className="agency-signature">
      <div className="signature-copy">
        <span className="eyebrow">Zee Brows Method</span>
        <h2>Digital growth designed like a brand system, not a bundle of services.</h2>
        <p>
          Zee Brows builds the connective tissue between strategy, content, ads, websites, branding, and video. The result is a sharper
          digital presence where every touchpoint looks intentional, speaks clearly, and moves the customer closer to action.
        </p>
      </div>
      <div className="signature-panel">
        {pillars.map(([title, text], index) => (
          <article key={title}>
            <b>{String(index + 1).padStart(2, "0")}</b>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="signature-process">
        {steps.map((step, index) => (
          <span key={step}>
            <i>{String(index + 1).padStart(2, "0")}</i>
            {step}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function CinematicHome() {
  const storyRef = useRef(null);
  const heroRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const [content] = useSiteContent();
  const home = content.home || defaultContent.home;
  const stages = content.stages?.length ? content.stages : fallbackStages;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(".mega-word");
      gsap.set(words, { opacity: 0.1, yPercent: 28, rotateX: -12 });
      gsap.fromTo(
        ".cinema-hero-copy .eyebrow, .cinema-hero-copy p, .cinema-hero-copy .actions",
        { opacity: 0, y: 34, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.08, ease: "power3.out", delay: 0.35 }
      );
      gsap.fromTo(
        ".cinema-hero .hero-logo-3d",
        { opacity: 0, scale: 0.78, rotateY: -34, rotateX: 14, filter: "blur(16px)" },
        { opacity: 1, scale: 1, rotateY: 0, rotateX: 0, filter: "blur(0px)", duration: 1.2, ease: "expo.out", delay: 0.18 }
      );

      ScrollTrigger.create({
        trigger: ".cinema-story",
        start: "top top",
        end: "+=640%",
        pin: ".cinema-pin",
        scrub: 0.8,
        onUpdate: (self) => {
          const next = Math.min(stages.length - 1, Math.floor(self.progress * stages.length));
          setActiveStage(next);
          gsap.to(".morph-object", {
            rotateY: self.progress * 34,
            rotateX: -8 + self.progress * 14,
            scale: 0.96 + self.progress * 0.12,
            y: Math.sin(self.progress * Math.PI * 2) * 22,
            duration: 0.25,
            overwrite: true
          });
          gsap.to(".stage-copy", {
            y: -self.progress * 44,
            rotateX: 4 - self.progress * 7,
            duration: 0.25,
            overwrite: true
          });
          gsap.to(".stage-scene.active img", {
            scale: 1.04 + self.progress * 0.06,
            duration: 0.25,
            overwrite: true
          });
          words.forEach((word, index) => {
            const distance = Math.abs(index / Math.max(words.length - 1, 1) - self.progress);
            gsap.to(word, {
              opacity: distance < 0.13 ? 1 : 0.12,
              yPercent: distance < 0.13 ? 0 : 28,
              rotateX: distance < 0.13 ? 0 : -14,
              duration: 0.22,
              overwrite: true
            });
          });
        }
      });

      gsap.utils.toArray(".section-head, .copy, .final-cta > div").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 44, rotateX: -8, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 82%" }
          }
        );
      });
    }, storyRef);

    return () => ctx.revert();
  }, [stages.length]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const move = (event) => {
      const rect = hero.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const animate = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      hero.style.setProperty("--hero-x", current.x.toFixed(3));
      hero.style.setProperty("--hero-y", current.y.toFixed(3));
      frame = requestAnimationFrame(animate);
    };

    hero.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
    };
  }, []);

  const CurrentIcon = stageMeta[stages[activeStage]?.key]?.icon || Target;

  return (
    <main className="cinematic-home" ref={storyRef}>
      <Loader text={home.loaderText || "Travel • Tech • Media"} />
      <section className="cinema-hero" ref={heroRef}>
        <MediaBackground src={home.heroImage || "/assets/hero.png"} alt="Zee Brows cinematic digital growth scene" priority />
        <ThreeAtmosphere />
        <div className="hero-orb" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="light-streaks" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="cinema-hero-copy">
          <span className="eyebrow">{home.eyebrow}</span>
          <SplitHeadline text={home.headline} />
          <p>{home.subtext}</p>
          <div className="actions">
            <Link className="btn" href="/contact">Start Your Project <ArrowUpRight size={18} /></Link>
            <Link className="btn btn-ghost" href="/portfolio">Explore Work</Link>
          </div>
        </div>
        <div className="cinema-hero-object">
          <HeroLogo3D src={home.heroLogo || "/assets/zee-brows-official-logo-cutout.webp"} />
        </div>
      </section>

      <section className="cinema-story">
        <div className="cinema-pin">
          <ThreeAtmosphere />
          <div className="stage-copy">
            <span className="eyebrow">{stages[activeStage].kicker}</span>
            <h2>{stages[activeStage].title}</h2>
            <p>{stages[activeStage].text}</p>
            <div className="stage-chip"><CurrentIcon size={18} /> {stages[activeStage].word}</div>
          </div>
          <div className="stage-object">
            <MorphObject activeStage={activeStage} stages={stages} />
          </div>
          <div className="stage-rail">
            {stages.map((stage, index) => (
              <span className={index === activeStage ? "active" : ""} key={stage.key}>{stage.title}</span>
            ))}
          </div>
          <div className="mega-words">
            {["STRATEGY", "CREATE", "LAUNCH", "OPTIMIZE", "GROW"].map((word) => (
              <b className="mega-word" key={word}>{word}</b>
            ))}
          </div>
        </div>
      </section>

      <section className="journey-strip">
        {stages.slice(0, 6).map((stage, index) => {
          const Icon = stageMeta[stage.key]?.icon || Target;
          return (
            <Link href={index === 0 ? "/about" : index === 2 ? "/services/google-ads-management" : "/services"} className="journey-item" key={stage.key}>
              <Icon size={24} />
              <span>{stage.title}</span>
              <small>{stage.word}</small>
            </Link>
          );
        })}
      </section>

      <AgencySignature />
      <PortfolioPreview />
      <Metrics />
      <FinalCta />
    </main>
  );
}
