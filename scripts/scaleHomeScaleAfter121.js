const fs = require("fs");
const path = require("path");

const DATA_FILE = path.resolve(__dirname, "../static/data/data.json");
const SCALE_FILE = path.resolve(__dirname, "../static/data/scale.json");

function stripJsonComments(text) {
  // Remove BOM
  let s = text.replace(/^\uFEFF/, "");
  // Remove /* ... */ comments
  s = s.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove // ... comments
  s = s.replace(/^\s*\/\/.*$/gm, "");
  return s;
}

function loadJsonSafe(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (_) {
    return JSON.parse(stripJsonComments(raw));
  }
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function makeBackup(originalPath) {
  const dir = path.dirname(originalPath);
  const base = path.basename(originalPath, path.extname(originalPath));
  const ext = path.extname(originalPath);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(dir, `${base}.backup-${stamp}${ext}`);
  fs.copyFileSync(originalPath, backupPath);
  return backupPath;
}

function toNumber(val) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = Number(val.trim());
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has("--dry-run") || args.has("-n");

  console.log("Loading data.json and scale.json...");
  const data = loadJsonSafe(DATA_FILE);
  const scale = loadJsonSafe(SCALE_FILE);

  // Build set of item names with 最終序號 > 121
  const targetNames = new Set();
  data.forEach((item) => {
    const idStr = item["最終序號"];
    const idNum = Number(idStr);
    const name = item["品項"];
    if (Number.isFinite(idNum) && idNum > 121 && name) {
      targetNames.add(name);
    }
  });

  let changed = 0;
  const changedItems = [];

  scale.forEach((entry) => {
    if (!entry || !entry.name) return;
    if (!targetNames.has(entry.name)) return;

    // Support both possible spellings just in case
    const key = Object.prototype.hasOwnProperty.call(entry, "homeScale")
      ? "homeScale"
      : Object.prototype.hasOwnProperty.call(entry, "homeSacle")
      ? "homeSacle"
      : null;

    if (!key) return;

    const current = toNumber(entry[key]);
    if (!Number.isFinite(current)) return;

    const next = Math.round(current * 1.5);
    if (next !== current) {
      if (!dryRun) entry[key] = String(next);
      changed++;
      changedItems.push({ name: entry.name, from: current, to: next });
    }
  });

  if (changed === 0) {
    console.log("No applicable entries found or no changes needed.");
    return;
  }

  if (dryRun) {
    console.log(`Dry-run: would update ${changed} items (no file written).`);
  } else {
    const backupPath = makeBackup(SCALE_FILE);
    console.log(`Backup created: ${backupPath}`);
    saveJson(SCALE_FILE, scale);
    console.log(`Updated ${changed} items in scale.json.`);
  }

  // Print a brief summary of changes (first 20)
  const sample = changedItems.slice(0, 20);
  sample.forEach((c) => {
    console.log(` - ${c.name}: ${c.from} -> ${c.to}`);
  });
  if (changedItems.length > sample.length) {
    console.log(`...and ${changedItems.length - sample.length} more.`);
  }
}

main();
