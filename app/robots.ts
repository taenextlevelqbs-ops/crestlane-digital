import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/portal", "/studio"],
    },
    sitemap: "https://crestlanedigital.com/sitemap.xml",
  };
}
