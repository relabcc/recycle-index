const fs = require("fs");
const path = require("path");

const SCALE_FILE = path.join(__dirname, "static/data/scale.json");
const CFG_FILE = path.join(__dirname, "static/data/cfg.json");
const DATA_FILE = path.join(__dirname, "static/data/data.json");

// Target visual heights (in pixels) for different contexts
const TARGET_HEIGHTS = {
  scale: 350, // Desktop default
  mobileScale: 800, // Mobile default
  homeScale: 750, // Home page default
  shareScale: 400, // Share image default
  mobileShareScale: 700, // Mobile share image default
};

// Viewport assumptions used to keep objects inside their visual frames
const VIEWPORT_RATIOS = {
  scale: 16 / 9,
  shareScale: 1200 / 630,
  mobileScale:2 / 3,
  mobileShareScale: 2 / 3,
};

// Safe-area ratios (0-1) that reserve room for copy at the frame edges
const SAFE_AREA_RULES = {
  scale: { left: 0.05, right: 0.22, top: 0.04, bottom: 0.14 },
  shareScale: { left: 0.1, right: 0.3, top: 0.12, bottom: 0.24 },
  mobileScale: { left: 0.05, right: 0.05, top: 0.18, bottom: 0.28 },
  mobileShareScale: { left: 0.08, right: 0.08, top: 0.26, bottom: 0.34 },
};

// Context-specific strategies describing how each scale should be calculated
const SCALE_RULES = {
  homeScale: {
    type: "square",
    size: TARGET_HEIGHTS.homeScale,
    paddingRatio: 0.08, // keep a small breathing room inside the square tile
  },
  scale: {
    type: "rect",
    targetHeight: TARGET_HEIGHTS.scale,
    viewportRatio: VIEWPORT_RATIOS.scale,
    safeArea: SAFE_AREA_RULES.scale,
  },
  mobileScale: {
    type: "rect",
    targetHeight: TARGET_HEIGHTS.mobileScale,
    viewportRatio: VIEWPORT_RATIOS.mobileScale,
    safeArea: SAFE_AREA_RULES.mobileScale,
  },
  shareScale: {
    type: "rect",
    targetHeight: TARGET_HEIGHTS.shareScale,
    viewportRatio: VIEWPORT_RATIOS.shareScale,
    safeArea: SAFE_AREA_RULES.shareScale,
    offsetTargets: { x: "x", y: "y" },
    offsetBias: { x: -15, y: 0 },
  },
  mobileShareScale: {
    type: "rect",
    targetHeight: TARGET_HEIGHTS.mobileShareScale,
    viewportRatio: VIEWPORT_RATIOS.mobileShareScale,
    safeArea: SAFE_AREA_RULES.mobileShareScale,
    offsetTargets: { x: "mobileX", y: "mobileY" },
    offsetBias: { x: 0, y: 0 },
  },
};

// Helper to check if a value is "empty" (treat zero-like and blank as empty)
const isEmpty = (val) => {
  if (val === null || val === undefined) return true;
  const s = String(val).trim();
  if (s === "") return true;
  // Remove common suffixes and whitespace, then test numeric value
  const cleaned = s.replace(/[%px\s]/gi, "");
  const n = Number(cleaned);
  if (!Number.isNaN(n) && n === 0) return true;
  return false;
};

// 0 is considered a valid value for position fields, so only blanks are treated as unset
const isUnset = (val) =>
  val === null || val === undefined || String(val).trim() === "";

function loadJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function calculateItemDimensions(layers) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  layers.forEach((layer) => {
    const x = parseFloat(layer["圖層X位置"]);
    const y = parseFloat(layer["圖層Y位置"]);
    const w = parseFloat(layer["圖層W寬度"]);
    const h = parseFloat(layer["圖層H高度"]);

    if (!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h)) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    }
  });

  if (minX === Infinity) return null;

  return {
    width: maxX - minX,
    height: maxY - minY,
  };
}

function normalizeSafeArea(area = {}) {
  return {
    top: area.top || 0,
    right: area.right || 0,
    bottom: area.bottom || 0,
    left: area.left || 0,
  };
}

function computeSafeAreaOffset(rule) {
  if (!rule || !rule.safeArea || !rule.offsetTargets) return null;
  const area = normalizeSafeArea(rule.safeArea);
  const centerX = (area.left + (1 - area.right)) / 2;
  const centerY = (area.top + (1 - area.bottom)) / 2;
  let offsetX = Math.round((0.5 - centerX) * 100);
  let offsetY = Math.round((0.5 - centerY) * 100);

  if (rule.offsetBias) {
    if (typeof rule.offsetBias.x === "number") offsetX += rule.offsetBias.x;
    if (typeof rule.offsetBias.y === "number") offsetY += rule.offsetBias.y;
  }

  return { x: offsetX, y: offsetY };
}

function computeScaleValue(field, dimensions) {
  if (!dimensions || !dimensions.width || !dimensions.height) return null;

  const rule = SCALE_RULES[field];
  if (rule) {
    if (rule.type === "square") {
      const paddingRatio = rule.paddingRatio || 0;
      const innerSize = rule.size * (1 - paddingRatio * 2);
      if (innerSize <= 0) return null;
      const widthFactor = innerSize / dimensions.width;
      const heightFactor = innerSize / dimensions.height;
      const limiter = widthFactor < heightFactor ? "width" : "height";
      return {
        value: Math.round(Math.min(widthFactor, heightFactor) * 100),
        limiter: `square-${limiter}`,
        offset: computeSafeAreaOffset(rule),
      };
    }

    if (rule.type === "rect") {
      const safeArea = normalizeSafeArea(rule.safeArea);
      const usableHeight =
        rule.targetHeight * (1 - safeArea.top - safeArea.bottom);
      const viewportWidth = rule.targetHeight * (rule.viewportRatio || 1);
      const usableWidth = viewportWidth * (1 - safeArea.left - safeArea.right);

      const candidates = [];
      if (usableHeight > 0) {
        candidates.push({
          axis: "height",
          factor: usableHeight / dimensions.height,
        });
      }
      if (usableWidth > 0 && Number.isFinite(usableWidth)) {
        candidates.push({
          axis: "width",
          factor: usableWidth / dimensions.width,
        });
      }

      if (candidates.length === 0) return null;

      const limiting = candidates.reduce((prev, curr) =>
        curr.factor < prev.factor ? curr : prev
      );

      return {
        value: Math.round(limiting.factor * 100),
        limiter: limiting.axis,
        offset: computeSafeAreaOffset(rule),
      };
    }
  }

  const fallbackHeight = TARGET_HEIGHTS[field];
  if (!fallbackHeight) return null;

  return {
    value: Math.round((fallbackHeight / dimensions.height) * 100),
    limiter: "height-only",
    offset: null,
  };
}

function applyOffsets(name, entry, field, scaleInfo) {
  const rule = SCALE_RULES[field];
  if (!rule || !rule.offsetTargets || !scaleInfo || !scaleInfo.offset) return 0;
  const { offsetTargets } = rule;
  let changes = 0;
  if (offsetTargets.x && !isUnset(scaleInfo.offset.x)) {
    if (isUnset(entry[offsetTargets.x])) {
      entry[offsetTargets.x] = scaleInfo.offset.x.toString();
      console.log(
        `Setting "${name}" ${offsetTargets.x}: ${scaleInfo.offset.x} (from ${field} safe-area center)`
      );
      changes++;
    }
  }
  if (offsetTargets.y && !isUnset(scaleInfo.offset.y)) {
    if (isUnset(entry[offsetTargets.y])) {
      entry[offsetTargets.y] = scaleInfo.offset.y.toString();
      console.log(
        `Setting "${name}" ${offsetTargets.y}: ${scaleInfo.offset.y} (from ${field} safe-area center)`
      );
      changes++;
    }
  }
  return changes;
}

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0) return null; // No filter, process all

  const ids = new Set();
  const argString = args.join(","); // Handle space separated args as well

  argString.split(",").forEach((part) => {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) ids.add(i);
      }
    } else {
      const num = Number(part);
      if (!isNaN(num)) ids.add(num);
    }
  });

  return ids;
}

function main() {
  console.log("Loading files...");
  const scaleData = loadJSON(SCALE_FILE);
  const cfgData = loadJSON(CFG_FILE);
  const dataInfo = loadJSON(DATA_FILE);

  // Create ID to Name mapping
  const idToName = {};
  dataInfo.forEach((item) => {
    idToName[parseInt(item["最終序號"])] = item["品項"];
  });

  // Parse arguments for ID filtering
  const targetIds = parseArgs();
  let targetNames = null;

  if (targetIds) {
    targetNames = new Set();
    targetIds.forEach((id) => {
      if (idToName[id]) {
        targetNames.add(idToName[id]);
      } else {
        console.warn(`Warning: ID ${id} not found in data.json`);
      }
    });
    console.log(`Targeting IDs: ${Array.from(targetIds).join(", ")}`);
    console.log(`Targeting Items: ${Array.from(targetNames).join(", ")}`);
  } else {
    console.log("Targeting ALL items.");
  }

  // Group cfg layers by item name
  const cfgMap = {};
  cfgData.forEach((item) => {
    const name = item["垃圾名稱"];
    if (!cfgMap[name]) cfgMap[name] = [];
    cfgMap[name].push(item);
  });

  let updatedCount = 0;

  // Build a name->entry map for quick lookup
  const scaleMap = {};
  scaleData.forEach((e) => {
    if (e && e.name) scaleMap[e.name] = e;
  });

  // Determine which item names to process
  const namesToProcess = targetNames
    ? Array.from(targetNames)
    : dataInfo.map((d) => d["品項"]);

  namesToProcess.forEach((name) => {
    const layers = cfgMap[name];

    if (!layers) {
      console.warn(`Warning: No config found for item "${name}"`);
      return;
    }

    const dimensions = calculateItemDimensions(layers);
    if (!dimensions) {
      console.warn(`Warning: Could not calculate dimensions for "${name}"`);
      return;
    }

    const fields = [
      "scale",
      "mobileScale",
      "homeScale",
      "shareScale",
      "mobileShareScale",
    ];
    const bboxSummary = `${Math.round(dimensions.width)}x${Math.round(
      dimensions.height
    )}`;

    const existing = scaleMap[name];

    if (existing) {
      // Update only empty fields in existing entry
      fields.forEach((field) => {
        if (isEmpty(existing[field])) {
          const scaleInfo = computeScaleValue(field, dimensions);
          if (!scaleInfo) return;
          const { value, limiter } = scaleInfo;
          console.log(
            `Updating "${name}" ${field}: ${value} (bbox ${bboxSummary}, limiter: ${limiter})`
          );
          existing[field] = value.toString();
          updatedCount++;
          updatedCount += applyOffsets(name, existing, field, scaleInfo);
        }
      });
    } else {
      // Create a new scale entry for this name
      const newEntry = {
        name: name,
        scale: "",
        x: "",
        y: "",
        shareScale: "",
        rotate: "",
        mobileScale: "",
        mobileX: "",
        mobileY: "",
        mobileShareScale: "",
        firstY: "",
        gap: "",
        explosionScale: "",
        homeScale: "",
        homeX: "",
        homeY: "",
        mobileFirstY: "",
        mobileExplosionY: "",
        faceNo: "",
        face: "translate(0%,0%)",
      };

      fields.forEach((field) => {
        const scaleInfo = computeScaleValue(field, dimensions);
        if (!scaleInfo) {
          console.warn(
            `Warning: no scale strategy for field "${field}" on "${name}"`
          );
          return;
        }
        const { value, limiter } = scaleInfo;
        console.log(
          `Creating "${name}" ${field}: ${value} (bbox ${bboxSummary}, limiter: ${limiter})`
        );
        newEntry[field] = value.toString();
        updatedCount++;
        updatedCount += applyOffsets(name, newEntry, field, scaleInfo);
      });

      scaleData.push(newEntry);
      scaleMap[name] = newEntry;
    }
  });

  if (updatedCount > 0) {
    console.log(`Saving ${updatedCount} updates to scale.json...`);
    saveJSON(SCALE_FILE, scaleData);
    console.log("Done.");
  } else {
    console.log("No missing values found for selected items. No changes made.");
  }
}

main();
