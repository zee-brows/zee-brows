import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminAuthenticated } from "@/lib/adminAuth";

function extensionFromMime(mimeType = "image/png") {
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("jpeg")) return "jpg";
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("webm")) return "webm";
  return "png";
}

export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dataUrl, fileName, mimeType } = await request.json();
  if (!dataUrl) return NextResponse.json({ error: "Missing upload data" }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "zee-brows-media";

  if (!url || !key) {
    return NextResponse.json({ url: dataUrl, mode: "inline-fallback" });
  }

  const base64 = dataUrl.split(",")[1];
  const bytes = Buffer.from(base64, "base64");
  const safeName = (fileName || `upload.${extensionFromMime(mimeType)}`).replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const path = `website/${Date.now()}-${safeName}`;
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: mimeType || "application/octet-stream",
    upsert: false
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, mode: "supabase-storage" });
}
