"use client";

import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/Motion";
import { useSiteContent } from "@/components/useSiteContent";

export default function ContactPage() {
  const [content, saveContent] = useSiteContent();
  const contact = content.contact;

  const submitMessage = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = {
      id: Date.now(),
      createdAt: new Date().toLocaleString(),
      name: form.get("Name") || "",
      businessName: form.get("Business Name") || "",
      email: form.get("Email") || "",
      phone: form.get("Phone / WhatsApp") || "",
      service: form.get("Service Interested In") || "",
      budget: form.get("Budget Range") || "",
      message: form.get("Message") || "",
      status: "New"
    };
    saveContent((current) => ({ ...current, messages: [message, ...(current.messages || [])] }));
    event.currentTarget.reset();
  };

  return (
    <main>
      <section className="page-hero compact">
        <Image src="/assets/portfolio-contact.png" alt="Digital communication network for Zee Brows" fill priority sizes="100vw" />
        <Reveal>
          <span className="eyebrow">Contact Us</span>
          <h1>Let&apos;s Grow Your Business Together</h1>
        </Reveal>
      </section>
      <section className="section contact-grid">
        <Reveal className="glass contact-form">
          <form onSubmit={submitMessage}>
            {["Name", "Business Name", "Email", "Phone / WhatsApp", "Service Interested In", "Budget Range"].map((field) => (
              <label key={field}>
                <span>{field}</span>
                <input name={field} type={field === "Email" ? "email" : "text"} />
              </label>
            ))}
            <label className="full">
              <span>Message</span>
              <textarea name="Message" rows="5" />
            </label>
            <button className="btn" type="submit">Send Inquiry</button>
          </form>
        </Reveal>
        <Reveal className="contact-info">
          <h2>Start with a Free Consultation</h2>
          <p>Tell us where your brand is now and where you want it to go. We&apos;ll shape the strategy from there.</p>
          <p><MessageCircle /> WhatsApp: {contact.whatsapp}</p>
          <p><Mail /> {contact.email}</p>
          <p><Phone /> {contact.phone}</p>
          <p><MapPin /> {contact.address}</p>
          <div className="socials">
            {["Facebook", "Instagram", "LinkedIn", "TikTok", "YouTube"].map((item) => <span key={item}>{item}</span>)}
          </div>
        </Reveal>
      </section>
    </main>
  );
}
