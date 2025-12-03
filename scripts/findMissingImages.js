const fs = require('fs');
const path = require('path');

const normalizeName = require('../src/utils/normalizeName');
const getFormatedTrashes = require('../src/containers/TrashPage/data/getFormatedTrashes');

const data = require('../static/data/data.json');
const cfg = require('../static/data/cfg.json');
const scale = require('../static/data/scale.json');

const imagesDir = path.resolve(__dirname, '..', 'src', 'images');

function listImageEntries(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const dirs = [];
  const files = [];
  entries.forEach((e) => {
    if (e.isDirectory()) dirs.push(e.name);
    else if (e.isFile()) files.push(e.name);
  });
  return { dirs, files };
}

function basenameNoExt(filename) {
  return filename.replace(/\.[^.]+$/, '');
}

function main() {
  const { dirs, files } = listImageEntries(imagesDir);

  const normalizedDirMap = {};
  dirs.forEach((d) => {
    const norm = normalizeName(d);
    if (!normalizedDirMap[norm]) normalizedDirMap[norm] = [];
    normalizedDirMap[norm].push(d);
  });

  const fileNameSet = new Set(files.map((f) => normalizeName(basenameNoExt(decodeURIComponent(f)))));

  const trashes = getFormatedTrashes(data, scale, cfg).filter((t) => t && t.id);

  const missing = [];
  const matched = [];
  trashes.forEach((t) => {
    const name = t.name;
    const normName = normalizeName(name);
    const dirMatches = normalizedDirMap[normName] || null;
    const fileMatches = fileNameSet.has(normName);
    if (!dirMatches && !fileMatches) {
      missing.push(name);
    } else {
      matched.push({ name, normName, fromDir: dirMatches, fromFile: fileMatches });
    }
  });

  console.log('Total trashes:', trashes.length);
  console.log('Matched items:', matched.length);
  console.log('Missing items:', missing.length);
  if (missing.length) {
    console.log('\n--- Missing list ---');
    missing.forEach((m) => console.log('-', m));
  }

  // show ambiguous directories that map to same normalized name
  const ambiguous = Object.entries(normalizedDirMap).filter(([, arr]) => arr.length > 1);
  if (ambiguous.length) {
    console.log('\n--- Ambiguous normalized directory names (multiple raw dirs) ---');
    ambiguous.forEach(([norm, arr]) => console.log(norm + ':', arr.join(', ')));
  }

  // no automatic suggestion logic -- keep output minimal and accurate
}

main();
