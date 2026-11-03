import fs from "fs";
import path from "path";

const SEARCH_DIRS = ["src"];
const EXTENSIONS = [".ts", ".tsx", ".css", ".js", ".mjs", ".json"];

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    if (f.name === "node_modules" || f.name === ".next" || f.name === ".git") continue;
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      scanDir(fullPath, fileList);
    } else if (EXTENSIONS.includes(path.extname(f.name))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = SEARCH_DIRS.flatMap((d) => scanDir(d));

const patterns = [
  { name: "font-mono", regex: /font-mono\b/g },
  { name: "font-mono-num", regex: /font-mono-num\b/g },
  { name: "monospace", regex: /monospace\b/gi },
  { name: "slashed-zero", regex: /slashed-zero\b/g },
  { name: "zero", regex: /"zero"\s*1|zero\s*1/g },
  { name: "tabular-nums", regex: /tabular-nums\b/g },
  { name: "fontFamily.mono", regex: /fontFamily\s*:\s*{[^}]*mono/g },
  { name: "ui-monospace", regex: /ui-monospace\b/g },
  { name: "JetBrains Mono", regex: /JetBrains Mono/g },
  { name: "Roboto Mono", regex: /Roboto Mono/g },
  { name: "Space Mono", regex: /Space Mono/g },
  { name: "Courier", regex: /Courier/g },
  { name: "Menlo", regex: /Menlo/g },
  { name: "code-tag", regex: /<code>|<kbd>|<pre>/g },
  { name: "toLocaleString", regex: /\.toLocaleString\(/g },
  { name: "toFixed", regex: /\.toFixed\(/g },
  { name: "hardcoded-currency", regex: /([0-9]+[.,]?[0-9]*\s*(?:đ|VND|VNĐ|₫))/g },
  { name: "hardcoded-k-or-M", regex: /([0-9]+(?:\.[0-9]+)?[kKmM]\s*(?:đ|VND|VNĐ|₫)?)/g },
];

const results = {};
for (const p of patterns) {
  results[p.name] = [];
}

for (const file of allFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const p of patterns) {
    const lines = content.split("\n");
    lines.forEach((line, index) => {
      if (p.regex.test(line)) {
        results[p.name].push({
          file: file.replace(/\\/g, "/"),
          line: index + 1,
          content: line.trim(),
        });
      }
    });
  }
}

console.log("=== AUDIT RESULTS ===");
for (const p of patterns) {
  console.log(`\n--- Pattern: ${p.name} (Found ${results[p.name].length} occurrences) ---`);
  // print first 15 for brevity
  results[p.name].slice(0, 15).forEach((r) => {
    console.log(`  ${r.file}:${r.line} -> ${r.content}`);
  });
  if (results[p.name].length > 15) {
    console.log(`  ... and ${results[p.name].length - 15} more`);
  }
}

fs.writeFileSync("scripts/audit-numerals-results.json", JSON.stringify(results, null, 2));
console.log("\nFull results saved to scripts/audit-numerals-results.json");
