"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { services } from "@/lib/data";
import { useSiteContent } from "@/components/useSiteContent";
import ExperienceEnhancers from "@/components/ExperienceEnhancers";

const menu = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["Case Studies", "/case-studies"],
  ["Contact", "/contact"]
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [solid, setSolid] = useState(false);
  const scrollRef = useRef({
    lastY: 0,
    up: 0,
    down: 0,
    ticking: false,
    stopTimer: null
  });
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const state = scrollRef.current;
    state.lastY = window.scrollY || 0;
    setSolid(state.lastY > 36);

    const update = () => {
      const currentY = Math.max(window.scrollY || 0, 0);
      const delta = currentY - state.lastY;
      state.ticking = false;

      if (Math.abs(delta) < 2) return;

      setScrolling(true);
      if (state.stopTimer) window.clearTimeout(state.stopTimer);
      state.stopTimer = window.setTimeout(() => {
        setScrolling(false);
        setSolid((window.scrollY || 0) > 36);
      }, 180);

      if (currentY <= 16) {
        state.up = 0;
        state.down = 0;
        setHidden(false);
        setSolid(false);
      } else if (delta < 0) {
        state.up += Math.abs(delta);
        state.down = 0;
        if (state.up >= 24) setHidden(false);
      } else if (delta > 0) {
        state.down += delta;
        state.up = 0;
        if (currentY > 96 && state.down >= 18) setHidden(true);
      }

      state.lastY = currentY;
    };

    const onScroll = () => {
      if (!scrollRef.current.ticking) {
        scrollRef.current.ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (state.stopTimer) window.clearTimeout(state.stopTimer);
    };
  }, []);

  useEffect(() => {
    if (open) setHidden(false);
  }, [open]);

  return (
    <header
      className={`site-header ${open ? "menu-open" : ""} ${hidden && !open ? "nav-hidden" : "nav-visible"} ${
        scrolling ? "nav-scrolling" : "nav-idle"
      } ${solid || open ? "nav-solid" : ""}`}
    >
      <Link className="brand" href="/">
        <Image src="/assets/logo-3d.png" alt="Zee Brows logo" width={54} height={54} />
        <span>
          <b>Zee Brows</b>
          <small>Travel • Tech • Media</small>
        </span>
      </Link>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label="Toggle menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className="primary-nav">
        {menu.map(([label, href]) =>
          label === "Services" ? (
            <div className={`nav-dropdown ${isActive(href) ? "active" : ""}`} key={label}>
              <Link className="nav-link" href={href}>
                Services <ChevronDown size={14} />
              </Link>
              <div className="dropdown-panel">
                {services.map((service) => (
                  <Link href={`/services/${service.slug}`} key={service.slug}>
                    {service.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link className={`nav-link ${isActive(href) ? "active" : ""}`} href={href} key={label}>
              {label}
            </Link>
          )
        )}
      </nav>
      <Link className="btn btn-small" href="/contact">
        Get Free Consultation <ArrowUpRight size={16} />
      </Link>
    </header>
  );
}

export function Footer() {
  const [content] = useSiteContent();
  const contact = content.contact;

  return (
    <footer className="footer">
      <div className="footer-brand">
        <Image src="/assets/logo-3d.png" alt="Zee Brows logo" width={76} height={76} />
        <h2>Zee Brows</h2>
        <p>Travel • Tech • Media</p>
        <p>Where strategy and style come together to elevate your brand digitally.</p>
      </div>
      <div>
        <h3>Company</h3>
        {["About", "Portfolio", "Case Studies", "Contact"].map((item) => (
          <Link href={`/${item.toLowerCase().replace(" ", "-")}`} key={item}>
            {item}
          </Link>
        ))}
      </div>
      <div>
        <h3>Services</h3>
        {services.map((service) => (
          <Link href={`/services/${service.slug}`} key={service.slug}>
            {service.title}
          </Link>
        ))}
      </div>
      <div>
        <h3>Contact</h3>
        <p><Mail size={15} /> {contact.email}</p>
        <p><Phone size={15} /> {contact.phone}</p>
        <p><MessageCircle size={15} /> {contact.whatsapp}</p>
        <p><MapPin size={15} /> {contact.address}</p>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  return (
    <a className="whatsapp" href="https://wa.me/94770000000" aria-label="Contact Zee Brows on WhatsApp">
      <MessageCircle size={24} />
    </a>
  );
}

export function SiteShell({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return children;

  return (
    <>
      <ExperienceEnhancers />
      <Header />
      {children}
      <WhatsAppButton />
      <Footer />
    </>
  );
}
