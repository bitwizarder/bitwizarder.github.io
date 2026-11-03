import { siteMeta } from "@/data/resumeContent";

export const dynamic = "force-static";

export default function sitemap() {
  return [
    {
      url: siteMeta.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
