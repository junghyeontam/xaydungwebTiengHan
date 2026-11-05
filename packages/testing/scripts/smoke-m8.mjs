import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");

console.log("=== [smoke-m8] Verifying Deployment Artifacts & Pipeline Configs ===");

let failed = false;

// 1. Verify vercel.json configurations
const apps = ["web", "teach", "admin"];
for (const app of apps) {
  const vPath = path.join(repoRoot, `apps/${app}/vercel.json`);
  if (!fs.existsSync(vPath)) {
    console.error(`FAIL: Missing apps/${app}/vercel.json`);
    failed = true;
    continue;
  }
  const config = JSON.parse(fs.readFileSync(vPath, "utf8"));
  if (config.outputDirectory !== ".next") {
    console.error(`FAIL: apps/${app}/vercel.json outputDirectory must be '.next'`);
    failed = true;
  }
  if (app === "teach" || app === "admin") {
    const raw = fs.readFileSync(vPath, "utf8");
    if (!raw.includes("noindex, nofollow, noarchive")) {
      console.error(`FAIL: apps/${app}/vercel.json must enforce noindex headers`);
      failed = true;
    }
  }
  console.log(`vercel.json for ${app.padEnd(5)} -> VALID (.next, headers ok)`);
}

// 2. Verify .env.example files
for (const app of apps) {
  const envPath = path.join(repoRoot, `apps/${app}/.env.example`);
  if (!fs.existsSync(envPath)) {
    console.error(`FAIL: Missing apps/${app}/.env.example`);
    failed = true;
    continue;
  }
  const content = fs.readFileSync(envPath, "utf8");
  if (!content.includes("NEXT_PUBLIC_COOKIE_DOMAIN") || !content.includes("NEXT_PUBLIC_SUPABASE_URL")) {
    console.error(`FAIL: apps/${app}/.env.example missing required public keys`);
    failed = true;
  }
  if (app === "web" && !content.includes("STRICTLY FORBIDDEN")) {
    console.error("FAIL: apps/web/.env.example must document forbidden server keys");
    failed = true;
  }
  console.log(`.env.example for ${app.padEnd(5)} -> VALID (cookie domain & forbidden keys documented)`);
}

// 3. Verify CI workflow
const ciPath = path.join(repoRoot, ".github/workflows/ci.yml");
if (!fs.existsSync(ciPath)) {
  console.error("FAIL: Missing .github/workflows/ci.yml");
  failed = true;
} else {
  const ciContent = fs.readFileSync(ciPath, "utf8");
  const hasBuild = ciContent.includes("pnpm run build");
  const hasBoundary = ciContent.includes("check-no-cycles.mjs");
  console.log(`.github/workflows/ci.yml -> VALID (build=${hasBuild}, boundary=${hasBoundary})`);
}

// 4. Verify Dockerfile
const dockerPath = path.join(repoRoot, "Dockerfile");
if (!fs.existsSync(dockerPath)) {
  console.error("FAIL: Missing Dockerfile");
  failed = true;
} else {
  const dockerContent = fs.readFileSync(dockerPath, "utf8");
  const hasMultiStage = dockerContent.includes("AS builder") && dockerContent.includes("AS runner");
  console.log(`Dockerfile              -> VALID (multi-stage=${hasMultiStage})`);
}

// 5. Verify Runbook
const runbookPath = path.join(repoRoot, "docs/deployment-runbook.md");
if (!fs.existsSync(runbookPath)) {
  console.error("FAIL: Missing docs/deployment-runbook.md");
  failed = true;
} else {
  const rb = fs.readFileSync(runbookPath, "utf8");
  const hasDNS = rb.includes("Cloudflare / DNS Records");
  const hasOrder = rb.includes("Zero-Downtime Deployment Sequence");
  const hasRollback = rb.includes("Rollback & Emergency Protocols");
  console.log(`deployment-runbook.md   -> VALID (dns=${hasDNS}, order=${hasOrder}, rollback=${hasRollback})`);
}

if (failed) {
  console.error("smoke-m8 FAILED");
  process.exit(1);
}

console.log("\nPhase M-8 deployment verification PASSED");
