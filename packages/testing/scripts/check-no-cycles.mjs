import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const packagesDir = path.join(repoRoot, "packages");
const appsDir = path.join(repoRoot, "apps");

const errors = [];

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".turbo") {
        results.push(...walkFiles(full));
      }
    } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// ==============================================================================
// 1. APPS CROSS-BOUNDARY ISOLATION
// ==============================================================================
const APP_NAMES = ["web", "teach", "admin"];

for (const app of APP_NAMES) {
  const appSrc = path.join(appsDir, app, "src");
  const files = walkFiles(appSrc);
  const siblings = APP_NAMES.filter((a) => a !== app);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const relFile = path.relative(repoRoot, file);

    for (const sib of siblings) {
      // Check relative path import or package import
      const forbiddenPatterns = [
        new RegExp(`from\\s+["'][^"']*apps/${sib}/`),
        new RegExp(`from\\s+["']@junghyeon/${sib}(/|["'])`),
        new RegExp(`import\\s*\\(["'][^"']*apps/${sib}/`),
        new RegExp(`import\\s*\\(["']@junghyeon/${sib}(/|["'])`),
      ];

      for (const pattern of forbiddenPatterns) {
        if (pattern.test(content)) {
          errors.push(
            `[Cross-App Boundary Violation] ${relFile} (${app}) illegally imports from sibling app '${sib}'`
          );
        }
      }
    }
  }
}

// ==============================================================================
// 2. PURE PACKAGES ISOLATION
// ==============================================================================
const PURE_PACKAGES = new Set(["ui", "content-renderer", "features", "i18n", "config"]);
const PRIVILEGED_PACKAGES = ["@junghyeon/auth", "@junghyeon/db", "@junghyeon/rbac"];

const packageNames = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const depGraph = new Map();

for (const pkg of packageNames) {
  const pkgJsonPath = path.join(packagesDir, pkg, "package.json");
  if (!fs.existsSync(pkgJsonPath)) continue;
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
  const fullPkgName = pkgJson.name;
  const deps = Object.keys({
    ...(pkgJson.dependencies || {}),
    ...(pkgJson.peerDependencies || {}),
  }).filter((d) => d.startsWith("@junghyeon/"));

  depGraph.set(fullPkgName, deps);

  const srcFiles = walkFiles(path.join(packagesDir, pkg, "src"));
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf8");
    const relFile = path.relative(repoRoot, file);

    // Rule: No package in packages/* may import from apps/*
    if (/from\s+["']([^"']*apps\/|@junghyeon\/(web|teach|admin))/.test(content)) {
      errors.push(`[Package Boundary Violation] ${relFile} imports from apps/*`);
    }

    // Rule: Pure packages cannot import from privileged packages (auth/db/rbac)
    if (PURE_PACKAGES.has(pkg)) {
      for (const priv of PRIVILEGED_PACKAGES) {
        if (
          content.includes(`"${priv}"`) ||
          content.includes(`'${priv}'`) ||
          content.includes(`${priv}/`)
        ) {
          errors.push(
            `[Pure Package Violation] ${relFile} (${fullPkgName}) imports privileged package ${priv}`
          );
        }
      }
    }
  }
}

// ==============================================================================
// 3. PACKAGE DEPENDENCY GRAPH ACYCLICITY (DFS)
// ==============================================================================
const visited = new Set();
const inStack = new Set();

function dfs(node, chain) {
  if (inStack.has(node)) {
    errors.push(`[Circular Dependency] ${[...chain, node].join(" -> ")}`);
    return;
  }
  if (visited.has(node)) return;
  visited.add(node);
  inStack.add(node);
  for (const neighbor of depGraph.get(node) || []) {
    dfs(neighbor, [...chain, node]);
  }
  inStack.delete(node);
}

for (const node of depGraph.keys()) {
  dfs(node, []);
}

// ==============================================================================
// 4. CLIENT BUNDLE & SOURCE SECRET LEAK SCAN
// ==============================================================================
const FORBIDDEN_CLIENT_SECRETS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "PAYOS_CHECKSUM_KEY",
  "PAYOS_API_KEY",
  "STRIPE_SECRET_KEY",
  "VIETQR_SECRET",
];

const webClientFiles = walkFiles(path.join(appsDir, "web", "src")).filter((file) => {
  // Check client files (components or pages using 'use client')
  const content = fs.readFileSync(file, "utf8");
  return (
    content.includes('"use client"') ||
    content.includes("'use client'") ||
    file.includes("/components/") ||
    file.includes("/(learner)/")
  );
});

for (const file of webClientFiles) {
  const content = fs.readFileSync(file, "utf8");
  const relFile = path.relative(repoRoot, file);

  for (const secret of FORBIDDEN_CLIENT_SECRETS) {
    if (content.includes(secret)) {
      errors.push(
        `[Secret Leak Violation] ${relFile} references server secret '${secret}' in client code`
      );
    }
  }
}

// Check build output chunks in apps/web if present
const webNextStatic = path.join(appsDir, "web", ".next", "static");
if (fs.existsSync(webNextStatic)) {
  const chunkFiles = walkFiles(webNextStatic);
  for (const chunk of chunkFiles) {
    const content = fs.readFileSync(chunk, "utf8");
    const relFile = path.relative(repoRoot, chunk);

    for (const secret of FORBIDDEN_CLIENT_SECRETS) {
      if (content.includes(secret)) {
        errors.push(
          `[Production Bundle Secret Leak] ${relFile} leaked server secret '${secret}' in compiled JS bundle!`
        );
      }
    }
  }
}

// ==============================================================================
// 5. REPORT RESULTS
// ==============================================================================
if (errors.length > 0) {
  console.error("\n❌ MONOREPO BOUNDARY VERIFICATION FAILED:");
  for (const err of errors) {
    console.error("  - " + err);
  }
  process.exit(1);
}

console.log(
  `\n[check-boundaries] PASS: Verified ${APP_NAMES.length} apps, ${depGraph.size} packages, 0 cross-app imports, 0 circular dependencies, and 0 client secret leaks.`
);
