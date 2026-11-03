import fs from "fs";
import path from "path";

// 1. Gather all actual page routes
function getPageRoutes(dir, baseRoute = "") {
  let routes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith("node_modules") || entry.name.startsWith(".next")) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      let segment = entry.name;
      // Handle route groups (e.g. (learner), (admin))
      if (segment.startsWith("(") && segment.endsWith(")")) {
        segment = "";
      }
      // Handle dynamic segments e.g. [locale], [slug]
      const nextBase = segment ? `${baseRoute}/${segment}` : baseRoute;
      routes = routes.concat(getPageRoutes(fullPath, nextBase));
    } else if (entry.name === "page.tsx") {
      routes.push(baseRoute || "/");
    }
  }
  return routes;
}

const appDir = path.resolve("src/app");
const allActualRoutes = getPageRoutes(appDir);
console.log("Found actual page routes:", allActualRoutes.length);
console.log(allActualRoutes.sort());

// 2. Scan all tsx files for hrefs
function scanHrefs(dir) {
  let links = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith("node_modules") || entry.name.startsWith(".next") || entry.name.startsWith(".")) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      links = links.concat(scanHrefs(fullPath));
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      // Find href="..." or href={`...`}
      const hrefRegex = /href=["']([^"'#?]+)["']/g;
      let match;
      while ((match = hrefRegex.exec(content)) !== null) {
        const link = match[1];
        if (link.startsWith("/") && !link.startsWith("//") && !link.startsWith("/api")) {
          links.push({ file: fullPath, link });
        }
      }
    }
  }
  return links;
}

const allLinks = scanHrefs(path.resolve("src"));
console.log("\nTotal internal links found:", allLinks.length);

// 3. Match links against actual routes
function routeMatches(link, actualRoute) {
  // Normalize
  const linkParts = link.split("/").filter(Boolean);
  const routeParts = actualRoute.split("/").filter(Boolean);

  // If actualRoute has [locale], strip it for matching or allow it
  const cleanRouteParts = routeParts.filter(p => p !== "[locale]");

  if (linkParts.length !== cleanRouteParts.length && linkParts.length !== routeParts.length) {
    return false;
  }

  const targetParts = linkParts.length === cleanRouteParts.length ? cleanRouteParts : routeParts;

  for (let i = 0; i < linkParts.length; i++) {
    const rPart = targetParts[i];
    if (rPart.startsWith("[") && rPart.endsWith("]")) {
      continue; // dynamic match
    }
    if (rPart !== linkParts[i]) {
      return false;
    }
  }
  return true;
}

const broken = [];
for (const { file, link } of allLinks) {
  // Ignore external or non-page links
  if (link.includes("${") || link.startsWith("/#") || link === "") continue;

  const matched = allActualRoutes.some(r => routeMatches(link, r));
  if (!matched) {
    // Check if it's an alias in middleware
    const aliases = [
      "/admin", "/admin/lessons", "/admin/vocabulary", "/admin/roadmap", "/admin/orders",
      "/admin/leads", "/admin/banners", "/admin/coupons", "/admin/staff", "/admin/audit",
      "/admin/analytics", "/learners", "/analytics", "/sales", "/consulting", "/marketing",
      "/settings", "/settings/roles", "/settings/audit-log", "/admin/health", "/admin/design",
      "/admin/consulting", "/admin/sales", "/admin/marketing", "/admin/content/lessons",
      "/admin/content/vocabulary", "/admin/content/roadmap", "/admin/sales/orders",
      "/admin/sales/leads", "/admin/marketing/banners", "/admin/settings/staff",
      "/admin/settings/roles", "/admin/audit-logs", "/admin/teaching/lessons",
      "/admin/teaching/lessons/new", "/admin/teaching/grammar", "/admin/teaching/vocabulary",
      "/admin/teaching/roadmap", "/admin/teaching/feedback", "/admin/teaching/analytics"
    ];
    if (!aliases.includes(link)) {
      broken.push({ file: path.relative(process.cwd(), file), link });
    }
  }
}

console.log("\nPotentially broken links count:", broken.length);
if (broken.length > 0) {
  console.log(JSON.stringify(broken, null, 2));
}
