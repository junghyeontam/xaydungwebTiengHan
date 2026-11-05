import { MetadataRoute } from "next";
import { getAllPublishedLessons } from "@/features/content-publishing/content-service";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://junghyeon.edu.vn";

  const staticRoutes = [
    "",
    "/roadmap",
    "/review",
    "/pronunciation",
    "/topik",
    "/consultation",
    "/profile",
    "/products",
  ];

  // Dynamically include all published lesson slugs
  const publishedLessons = getAllPublishedLessons();
  const lessonRoutes = publishedLessons.map((l) => `/lessons/${l.slug}`);

  const allRoutes = [...staticRoutes, ...lessonRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
