import { cookies } from "next/headers";

export const adminCookieName = "zee_brows_admin";

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "admin@zeebrows.com",
    password: process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "admin123")
  };
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(adminCookieName)?.value === "authenticated";
}
