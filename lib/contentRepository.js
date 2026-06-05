import { createClient } from "@supabase/supabase-js";
import { defaultContent, mergeContent } from "@/lib/siteContent";

const tableName = "site_content";
const rowId = "zee-brows";

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function memoryStore() {
  if (!globalThis.__zeeBrowsContent) globalThis.__zeeBrowsContent = defaultContent;
  return globalThis.__zeeBrowsContent;
}

export async function getSiteContent() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mergeContent(memoryStore());

  const { data, error } = await supabase.from(tableName).select("content").eq("id", rowId).single();
  if (error && error.code !== "PGRST116") throw error;
  return mergeContent(data?.content || defaultContent);
}

export async function saveSiteContent(content) {
  const merged = mergeContent(content);
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    globalThis.__zeeBrowsContent = merged;
    return merged;
  }

  const { error } = await supabase
    .from(tableName)
    .upsert({ id: rowId, content: merged, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) throw error;
  return merged;
}
