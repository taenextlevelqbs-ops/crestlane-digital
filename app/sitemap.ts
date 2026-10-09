import type { MetadataRoute } from "next";
import { caseStudies } from "./work/case-studies";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://crestlanedigital.com";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map(({ slug }) => ({ url: `${base}/work/${slug}`, changeFrequency: "yearly" as const, priority: 0.75 })),
  ];
}
