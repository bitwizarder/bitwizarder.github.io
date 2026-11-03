import { siteMeta } from "@/data/resumeContent";

export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      }
    ],
    sitemap: `${siteMeta.siteUrl}/sitemap.xml`,
    host: siteMeta.siteUrl
  };
}
