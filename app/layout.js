import "./globals.css";
import { SiteShell } from "@/components/SiteShell";
import { getSiteContent } from "@/lib/contentRepository";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const content = await getSiteContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords.split(",").map((keyword) => keyword.trim())
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
