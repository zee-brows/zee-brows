"use client";

import { useEffect, useState } from "react";
import { defaultContent, mergeContent } from "@/lib/siteContent";

export async function writeStoredContent(nextContent) {
  const merged = mergeContent(nextContent);
  const response = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(merged)
  });
  if (!response.ok) throw new Error("Unable to save site content");
  const saved = await response.json();
  window.dispatchEvent(new CustomEvent("zee-brows-content-updated", { detail: saved }));
  return mergeContent(saved);
}

export function useSiteContent() {
  const [content, setContent] = useState(defaultContent);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setStatus("loading");
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        const next = response.ok ? await response.json() : defaultContent;
        if (active) setContent(mergeContent(next));
        if (active) setStatus("ready");
      } catch {
        if (active) setContent(defaultContent);
        if (active) setStatus("error");
      }
    };
    load();
    const sync = (event) => setContent(mergeContent(event.detail || defaultContent));
    window.addEventListener("zee-brows-content-updated", sync);
    return () => {
      active = false;
      window.removeEventListener("zee-brows-content-updated", sync);
    };
  }, []);

  const saveContent = async (updater) => {
    let optimistic;
    setContent((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      optimistic = mergeContent(next);
      return optimistic;
    });
    setStatus("saving");
    try {
      const saved = await writeStoredContent(optimistic);
      setContent(saved);
      setStatus("ready");
      return saved;
    } catch (error) {
      setStatus("error");
      throw error;
    }
  };

  return [content, saveContent, status];
}
