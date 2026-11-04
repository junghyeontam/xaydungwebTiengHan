import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const packagesDir = path.join(repoRoot, "packages");

const packageNames = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const depGraph = new Map();
const errors = [];

const PURE_PACKAGES = new Set(["ui", "content-renderer", "features", "i18n", "config"]);
const PRIVILEGED_IMPORTS = ["@junghyeon/auth", "@junghyeon/db", "@junghyeon/rbac"];

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full));
    } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

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

  // Scan source files for forbidden imports
  const srcFiles = walkFiles(path.join(packagesDir, pkg, "src"));
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf8");
    const relFile = path.relative(repoRoot, file);

    // Rule 1: No package in packages/* may import from apps/*
    if (/from\s+["']([^"']*apps\/|@junghyeon\/(web|teach|admin))/.test(content)) {
      errors.push(`[Boundary Violation] ${relFile} imports from apps/*`);
    }

    // Rule 2: Pure packages (ui, content-renderer, features) cannot import from auth/db/rbac
    if (PURE_PACKAGES.has(pkg)) {
      for (const priv of PRIVILEGED_IMPORTS) {
        if (content.includes(`"${priv}"`) || content.includes(`'${priv}'`) || content.includes(`${priv}/`)) {
          errors.push(`[Pure Package Violation] ${relFile} (${fullPkgName}) imports privileged package ${priv}`);
        }
      }
    }
  }
}

// Rule 3: Detect cycles in package dependency graph using DFS
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

if (errors.length > 0) {
  console.error("Package boundary / circular dependency check FAILED:");
  for (const err of errors) {
    console.error("  - " + err);
  }
  process.exit(1);
}

console.log(
  `[check-no-cycles] PASS: Verified ${depGraph.size} workspace packages with 0 circular dependencies and 0 boundary violations.`
);
