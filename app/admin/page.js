"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BarChart3, BriefcaseBusiness, FileImage, Home, Inbox, LogOut, Plus, Save, Search, Settings, Trash2 } from "lucide-react";
import { defaultContent } from "@/lib/siteContent";
import { useSiteContent } from "@/components/useSiteContent";
import { isVideoSource } from "@/components/Media";

const tabs = [
  ["home", "Home", Home],
  ["stages", "Scroll Stages", BarChart3],
  ["services", "Services", BriefcaseBusiness],
  ["portfolio", "Portfolio", FileImage],
  ["messages", "Messages", Inbox],
  ["seo", "SEO", Search],
  ["contact", "Contact", Settings]
];

function Field({ label, value, onChange, multiline = false }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value || ""} rows="4" onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input value={value || ""} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function UploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const upload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true);
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl: reader.result, fileName: file.name, mimeType: file.type })
        });
        const result = response.ok ? await response.json() : { url: reader.result };
        onChange(result.url);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="admin-upload">
      <span>{label}</span>
      <div>
        {value && isVideoSource(value) ? <video src={value} width="168" height="96" muted controls /> : null}
        {value && !isVideoSource(value) ? <Image src={value} alt="" width={168} height={96} /> : null}
        {!value ? <em>No media selected</em> : null}
        <input type="file" accept="image/*,video/*" onChange={upload} />
        {uploading ? <em>Uploading...</em> : null}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [content, saveContent, status] = useSiteContent();
  const [activeTab, setActiveTab] = useState("home");
  const messageCount = content.messages?.length || 0;

  const save = (section, value) => saveContent((current) => ({ ...current, [section]: value }));
  const updateArray = (section, index, patch) => {
    saveContent((current) => {
      const next = [...(current[section] || [])];
      next[index] = { ...next[index], ...patch };
      return { ...current, [section]: next };
    });
  };
  const removeArrayItem = (section, index) => {
    saveContent((current) => ({ ...current, [section]: (current[section] || []).filter((_, itemIndex) => itemIndex !== index) }));
  };
  const addProject = () => {
    saveContent((current) => ({
      ...current,
      projects: [
        ...(current.projects || []),
        {
          name: "New Project",
          industry: "Industry",
          service: "Service provided",
          result: "Short result summary",
          image: "/assets/portfolio-contact.png"
        }
      ]
    }));
  };

  const exportJson = useMemo(() => JSON.stringify(content, null, 2), [content]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const resetContent = async () => saveContent(defaultContent);

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Image src="/assets/logo-3d.png" alt="Zee Brows" width={72} height={72} />
        <h1>Zee Brows Admin</h1>
        <nav>
          {tabs.map(([key, label, Icon]) => (
            <button className={activeTab === key ? "active" : ""} key={key} onClick={() => setActiveTab(key)}>
              <Icon size={17} /> {label}
              {key === "messages" && messageCount > 0 ? <b>{messageCount}</b> : null}
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={logout}><LogOut size={16} /> Logout</button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="eyebrow">Website CMS</span>
            <h2>{tabs.find(([key]) => key === activeTab)?.[1]}</h2>
            <p className="admin-save-status">{status === "saving" ? "Saving changes..." : status === "error" ? "Save/load error" : "Content synced"}</p>
          </div>
          <div className="admin-actions">
            <button className="btn btn-ghost" onClick={resetContent}>Reset Demo Content</button>
            <button className="btn" onClick={() => saveContent(content)}><Save size={17} /> Save</button>
          </div>
        </header>

        {activeTab === "home" && (
          <div className="admin-panel">
            <Field label="Loader Text" value={content.home.loaderText} onChange={(value) => save("home", { ...content.home, loaderText: value })} />
            <Field label="Hero Eyebrow" value={content.home.eyebrow} onChange={(value) => save("home", { ...content.home, eyebrow: value })} />
            <Field label="Hero Headline" value={content.home.headline} onChange={(value) => save("home", { ...content.home, headline: value })} multiline />
            <Field label="Hero Subtext" value={content.home.subtext} onChange={(value) => save("home", { ...content.home, subtext: value })} multiline />
            <UploadField label="Hero Image / Video Poster" value={content.home.heroImage} onChange={(value) => save("home", { ...content.home, heroImage: value })} />
          </div>
        )}

        {activeTab === "stages" && (
          <div className="admin-list">
            {content.stages.map((stage, index) => (
              <article className="admin-panel" key={stage.key}>
                <h3>{stage.kicker} - {stage.title}</h3>
                <Field label="Title" value={stage.title} onChange={(value) => updateArray("stages", index, { title: value })} />
                <Field label="Animated Word" value={stage.word} onChange={(value) => updateArray("stages", index, { word: value })} />
                <Field label="Text" value={stage.text} onChange={(value) => updateArray("stages", index, { text: value })} multiline />
                <UploadField label="Stage Visual" value={stage.image} onChange={(value) => updateArray("stages", index, { image: value })} />
              </article>
            ))}
          </div>
        )}

        {activeTab === "services" && (
          <div className="admin-list">
            {content.services.map((service, index) => (
              <article className="admin-panel" key={service.slug}>
                <h3>{service.title}</h3>
                <Field label="Title" value={service.title} onChange={(value) => updateArray("services", index, { title: value })} />
                <Field label="Short Description" value={service.short} onChange={(value) => updateArray("services", index, { short: value })} multiline />
                <Field label="Page Description" value={service.description} onChange={(value) => updateArray("services", index, { description: value })} multiline />
                <UploadField label="Service Visual" value={service.visual} onChange={(value) => updateArray("services", index, { visual: value })} />
              </article>
            ))}
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="admin-list">
            <button className="btn" onClick={addProject}><Plus size={17} /> Add Project / Case Study</button>
            {content.projects.map((project, index) => (
              <article className="admin-panel" key={`${project.name}-${index}`}>
                <div className="admin-row-head">
                  <h3>{project.name}</h3>
                  <button onClick={() => removeArrayItem("projects", index)}><Trash2 size={16} /></button>
                </div>
                <Field label="Project / Client Name" value={project.name} onChange={(value) => updateArray("projects", index, { name: value })} />
                <Field label="Industry" value={project.industry} onChange={(value) => updateArray("projects", index, { industry: value })} />
                <Field label="Service Provided" value={project.service} onChange={(value) => updateArray("projects", index, { service: value })} />
                <Field label="Result Summary" value={project.result} onChange={(value) => updateArray("projects", index, { result: value })} multiline />
                <UploadField label="Project Image" value={project.image} onChange={(value) => updateArray("projects", index, { image: value })} />
              </article>
            ))}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="admin-list">
            {messageCount === 0 ? <p className="admin-empty">No contact messages yet.</p> : null}
            {(content.messages || []).map((message, index) => (
              <article className="admin-panel" key={message.id}>
                <div className="admin-row-head">
                  <h3>{message.name || "Website Inquiry"}</h3>
                  <button onClick={() => removeArrayItem("messages", index)}><Trash2 size={16} /></button>
                </div>
                <p>{message.createdAt}</p>
                <p><b>Business:</b> {message.businessName}</p>
                <p><b>Email:</b> {message.email}</p>
                <p><b>Phone:</b> {message.phone}</p>
                <p><b>Service:</b> {message.service}</p>
                <p><b>Budget:</b> {message.budget}</p>
                <p>{message.message}</p>
              </article>
            ))}
          </div>
        )}

        {activeTab === "seo" && (
          <div className="admin-panel">
            <Field label="Meta Title" value={content.seo.title} onChange={(value) => save("seo", { ...content.seo, title: value })} />
            <Field label="Meta Description" value={content.seo.description} onChange={(value) => save("seo", { ...content.seo, description: value })} multiline />
            <Field label="Keywords" value={content.seo.keywords} onChange={(value) => save("seo", { ...content.seo, keywords: value })} multiline />
            <label className="admin-field">
              <span>JSON Export / Supabase Seed</span>
              <textarea readOnly rows="12" value={exportJson} />
            </label>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="admin-panel">
            {Object.entries(content.contact).map(([key, value]) => (
              <Field
                key={key}
                label={key.replaceAll("_", " ")}
                value={value}
                onChange={(nextValue) => save("contact", { ...content.contact, [key]: nextValue })}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
