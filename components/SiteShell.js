"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={`site-header ${open ? "menu-open" : ""}`}>
      <Link className="brand" href="/">
        <Image src="/assets/logo-3d.png" alt="Zee Brows logo" width={54} height={54} />
        <span>
          <b>Zee Brows</b>
          <small>Travel • Tech • Media</small>
        </span>
      </Link>
      <button className="mobile-menu-toggle" type="button" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className="primary-nav">
        {menu.map(([label, href]) =>
          label === "Services" ? (
            <div className="nav-dropdown" key={label}>
              <Link href={href}>
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
            <Link href={href} key={label}>
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
