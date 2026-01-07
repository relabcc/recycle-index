const fs = require("fs");
const fse = require("fs-extra");
const Rematrix = require("rematrix");

const { get, mapValues, mapKeys } = require("lodash");
const path = require("path");
const util = require("util");
const { registerFont, createCanvas, loadImage } = require("canvas");

const family = "Noto Sans CJK TC";
registerFont(path.resolve(__dirname, "fonts/NotoSansCJKtc-Black.otf"), {
  family,
});
const imgSize = [850, 624];

const WIDTH = 1200;
const HEIGHT = 630;

const colorsCfg = {
  A: "#22bd73",
  B: "#ffa800",
  C: "#FF6695",
};

const dataKeys = {
  品項: "name",
  "可分解為哪些部分/材質（for網站）": "partsDetail",
  同義詞: "synonym",
  回收前使用者應做什麼處理: "handling",
  "處理後應該丟哪一類?": "belongsTo",
  使用場域: "places",
  各縣市回收狀況: "recyclable",
  回收率: "recycleRate",
  資源化比例: "resourceRate",
  文案: "description",
  標籤: "recycleValue",
  回收狀況: "recycleStatus",
  祝福文案: "share",
  材質備註: "partsNote",
  處理步驟備註: "recycleNote",
  "使用建議（替代方案）": "alternative",
};

const remapKeys = (data, keyMap) =>
  data.map((dd, id) => ({
    id,
    ...mapKeys(dd, (v, k) => keyMap[k] || k),
  }));

const degToRad = (v) => ((v ?? 0) * Math.PI) / 180;

const readfile = util.promisify(fs.readFile);

const parseTransform = (transform) => {
  const pttn = /(\w+)\(([^)]+)\)/g;
  const getNumber = /-?\d+(?:\.\d+)?/g;
  const obj = {};
  const ops = [];

  let pair;
  while ((pair = pttn.exec(transform))) {
    const [, name, cfg] = pair;
    const nums = [];
    let m;
    while ((m = getNumber.exec(cfg))) {
      nums.push(parseFloat(m[0]));
    }
    obj[name] = nums.length > 1 ? nums : nums[0];
    ops.push({ name, nums });
  }

  const c = { x: imgSize[0] / 2, y: imgSize[1] / 2 };
  const wrapCenter = (m) =>
    Rematrix.multiply(Rematrix.translate(c.x, c.y), m, Rematrix.translate(-c.x, -c.y));

  const opMatrix = ({ name, nums }) => {
    if (name === "translate") {
      const arr = Array.isArray(nums) ? nums : [nums, 0];
      return Rematrix.translate(
        imgSize[0] * (arr[0] || 0) / 100,
        imgSize[1] * (arr[1] || 0) / 100
      );
    }
    if (name === "translateX") {
      return Rematrix.translate(imgSize[0] * (nums[0] || 0) / 100, 0);
    }
    if (name === "translateY") {
      return Rematrix.translate(0, imgSize[1] * (nums[0] || 0) / 100);
    }
    if (name === "rotate") {
      return wrapCenter(Rematrix.rotate(degToRad(nums[0])));
    }
    if (name === "scale") {
      const sx = nums[0] ?? 1;
      const sy = nums[1] ?? sx;
      return wrapCenter(Rematrix.scale(sx, sy));
    }
    if (name === "scaleX") {
      return wrapCenter(Rematrix.scale(nums[0] ?? 1, 1));
    }
    if (name === "scaleY") {
      return wrapCenter(Rematrix.scale(1, nums[0] ?? 1));
    }
    if (name === "skew") {
      return wrapCenter(Rematrix.skew(degToRad(nums[0]), degToRad(nums[1])));
    }
    if (name === "skewX") {
      return wrapCenter(Rematrix.skew(degToRad(nums[0]), 0));
    }
    if (name === "skewY") {
      return wrapCenter(Rematrix.skew(0, degToRad(nums[0])));
    }
    return Rematrix.identity();
  };

  const matrices = ops.map(opMatrix);
  const matrix = matrices.length ? matrices.reduce(Rematrix.multiply) : Rematrix.identity();

  return [matrix, obj];
};

// 掃描 src/images，建立「品項名稱 → 主圖片路徑」索引
const buildImagesIndex = () => {
  const root = path.resolve(__dirname, "src/images");
  const items = {};
  let dirs;
  try {
    dirs = fs.readdirSync(root, { withFileTypes: true });
  } catch (e) {
    console.error("Failed to read images root:", root, e);
    return items;
  }

  dirs
    .filter((d) => d.isDirectory && d.isDirectory())
    .forEach((dir) => {
      const dirPath = path.join(root, dir.name);
      let files;
      try {
        files = fs.readdirSync(dirPath);
      } catch (e) {
        console.warn("Failed to read images dir:", dirPath, e);
        return;
      }

      files.forEach((file) => {
        // 主圖片規則：png檔且檔名不含 '-'（部位/材質通常以 '-' 區分）
        if (/\.png$/i.test(file) && !file.includes("-")) {
          const base = file.replace(/\.png$/i, "");
          const decodedKey = base.replace(/%2F/g, "/");
          const filePath = path.join(dirPath, file);
          // 同時提供未解碼與解碼兩種鍵，提升配對成功率
          items[decodedKey] = filePath;
          items[base] = filePath;
        }
      });
    });

  return items;
};

// 參數解析（優先使用 CLI args，其次環境變數）
const parseArgs = (argv) => {
  const out = {};
  const longMap = {
    debug: "debug",
    "grid-step": "gridStep",
    start: "start",
    end: "end",
    name: "name",
  };
  const shortMap = {
    d: "debug",
    g: "gridStep",
    s: "start",
    e: "end",
    n: "name",
  };
  const toVal = (key, val) => {
    if (key === "debug") {
      if (val === undefined) return true;
      return ["1", "true", "yes"].includes(String(val).toLowerCase());
    }
    if (key === "name") {
      return val;
    }
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  };

  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (tok.startsWith("--")) {
      const [rawKey, maybeVal] = tok.slice(2).split("=");
      const key = longMap[rawKey];
      if (!key) continue;
      if (maybeVal !== undefined) {
        out[key] = toVal(key, maybeVal);
      } else if (i + 1 < argv.length && !argv[i + 1].startsWith("-")) {
        out[key] = toVal(key, argv[++i]);
      } else {
        out[key] = toVal(key, undefined);
      }
    } else if (tok.startsWith("-")) {
      const raw = tok.slice(1);
      for (const ch of raw) {
        const key = shortMap[ch];
        if (!key) continue;
        // short flag may take a value in next token only if single-char
        if (raw.length === 1 && i + 1 < argv.length && !argv[i + 1].startsWith("-")) {
          out[key] = toVal(key, argv[++i]);
        } else {
          out[key] = toVal(key, undefined);
        }
      }
    }
  }
  return out;
};

const ARGS = parseArgs(process.argv.slice(2));
// Debug 控制
const DEBUG = ARGS.debug ?? (process.env.SHARE_DEBUG === "1");
const GRID_STEP = ARGS.gridStep ?? +(process.env.SHARE_GRID_STEP || 50);
const START = ARGS.start ?? +(process.env.SHARE_START || 0);
const END = ARGS.end ?? (process.env.SHARE_END ? +process.env.SHARE_END : undefined);
const NAME = ARGS.name;

const drawGrid = (ctx, w, h, step = GRID_STEP) => {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  for (let x = 0; x <= w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // 軸線
  ctx.strokeStyle = "rgba(255,0,0,0.35)";
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();
  ctx.restore();
};

const drawCross = (ctx, x, y, size = 12, color = "rgba(255,0,0,0.65)") => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.lineTo(x + size, y);
  ctx.moveTo(x, y - size);
  ctx.lineTo(x, y + size);
  ctx.stroke();
  ctx.restore();
};

const getFaceImage = async (data) => {
  const face = await loadImage(
    path.resolve(__dirname, `faces/face${data.transform.faceNo}.svg`)
  );
  const canvas = createCanvas(...imgSize);
  const ctx = canvas.getContext("2d");
  const [faceMatrix, transformCfg] = parseTransform(data.transform.face.trim());

  // Apply full matrix (matches Face AbsCenter + CSS transform order)
  ctx.setTransform(
    faceMatrix[0],
    faceMatrix[1],
    faceMatrix[4],
    faceMatrix[5],
    faceMatrix[12],
    faceMatrix[13]
  );

  if (DEBUG) {
    drawGrid(ctx, imgSize[0], imgSize[1]);
  }
  ctx.drawImage(face, 0, 0, ...imgSize);
  const dataURL = canvas.toDataURL();
  const dirName = path.resolve(__dirname, `public/share/${data.id}`);
  return new Promise(async (resolve) => {
    await fse.ensureDir(dirName);
    const savePng = fs.createWriteStream(path.resolve(dirName, "face.png"));
    canvas.pngStream().pipe(savePng);

    savePng.on("close", async () => {
      const face = await loadImage(dataURL);
      resolve([face, transformCfg]);
    });
  });
};

const createOg = async (data) => {
  if (!data.img) {
    throw new Error("no image");
  }
  const shape = await loadImage(
    path.resolve(__dirname, "src/containers/TrashPage/share-bg.svg")
  );
  const logo = await loadImage(
    path.resolve(__dirname, "src/containers/logo.svg")
  );
  const trash = await loadImage(fs.readFileSync(data.img));
  const [face, transformObj] = await getFaceImage(data);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");
  // 填滿底圖
  ctx.fillStyle = colorsCfg[data.recycleValue];
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  if (DEBUG) {
    // 全局觀察對齊：背景網格
    drawGrid(ctx, WIDTH, HEIGHT);
  }
  ctx.drawImage(logo, 1004, 583.5, 168, 27.8);
  ctx.drawImage(shape, 149, 57, 990.6, 538);
  const s = (data.transform.shareScale || 100) / 100;
  const trashSize = [imgSize[0] * s, imgSize[1] * s];
  const trashPos = [
    (trashSize[0] * ((data.transform.x || 0) * 1 + 10)) / 100,
    HEIGHT / 2 - (trashSize[1] * ((data.transform.y || 0) * 1 + 35)) / 100,
  ];
  const transformOrigin = [
    trashPos[0] + trashSize[0] / 2,
    trashPos[1] + trashSize[1] / 2,
  ];
  const r = ((data.transform.rotate || 0) * Math.PI) / 180;
  if (DEBUG) {
    // 標示 transform 原點
    drawCross(ctx, transformOrigin[0], transformOrigin[1], 14, "rgba(0,128,255,0.85)");
  }
  ctx.translate(...transformOrigin);
  ctx.rotate(r);
  ctx.drawImage(trash, -trashSize[0] / 2, -trashSize[1] / 2, ...trashSize);
  // face 已在自身畫布中套用 rotate/scale/skew 以及 translate，
  // 這裡僅需與 trash 同步基準對齊。
  ctx.drawImage(face, -trashSize[0] / 2, -trashSize[1] / 2, ...trashSize);

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // 設定文字顏色
  ctx.fillStyle = "#000";

  // 設定文字大小、字體、對齊
  ctx.font = `37px "${family}"`;
  ctx.textAlign = "left";

  // 上字 (text, x, y)
  ctx.fillText("＃如果你不好好丟垃圾", 571, 288);

  // 更新文字顏色
  ctx.fillStyle = colorsCfg[data.recycleValue];

  ctx.font = `56px "${family}"`;
  if (data.share) {
    ctx.fillText(data.share.substring(0, 7), 573, 368);
    if (data.share.length > 7) {
      ctx.fillText(data.share.substring(7), 573, 442);
    }
  }

  if (DEBUG) {
    // 臉部左上角（與 trash 同位置）在世界座標
    const localX = -trashSize[0] / 2;
    const localY = -trashSize[1] / 2;
    const worldX = transformOrigin[0] + (localX * Math.cos(r) - localY * Math.sin(r));
    const worldY = transformOrigin[1] + (localX * Math.sin(r) + localY * Math.cos(r));
    drawCross(ctx, worldX, worldY, 10, "rgba(255,0,0,0.9)");
    // 說明文字
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.font = `20px "${family}"`;
    const info = [
      `name: ${data.name}`,
      `shareScale: ${data.transform.shareScale}`,
      `x: ${data.transform.x}, y: ${data.transform.y}, rotate(deg): ${data.transform.rotate}`,
      `face translate(%): ${transformObj.translate?.[0]}, ${transformObj.translate?.[1]}`,
      `face scale: ${transformObj.scale}`,
    ];
    info.forEach((t, i) => ctx.fillText(t, 24, 40 + i * 24));
    ctx.restore();
  }

  const dirName = path.resolve(__dirname, `static/share`);
  await fse.ensureDir(dirName);
  return new Promise((resolve) => {
    const saveJpg = fs.createWriteStream(
      path.resolve(dirName, `${+data.id + 1}.jpg`)
    );
    canvas
      .createJPEGStream({
        quality: 0.95,
      })
      .pipe(saveJpg);

    saveJpg.on("close", resolve);
  });
};

Promise.all(
  ["scale", "data"].map((n) =>
    readfile(path.resolve(__dirname, `static/data/${n}.json`)).then((str) =>
      JSON.parse(str.toString())
    )
  )
).then(([scale, data]) => {
  const imagesIndex = buildImagesIndex();
  const scales = scale.reduce((all, d) => {
    all[d.name] = d;
    return all;
  }, {});

  const transformed = remapKeys(
    data.filter((d) => d["最終序號"]),
    dataKeys
  ).map((d) => ({
    ...d,
    // 尋找主圖片：優先用原名，其次用編碼名
    img:
      imagesIndex[d.name] ||
      imagesIndex[d.name && d.name.replace(/\//g, "%2F")] ||
      null,
    transform: mapValues(scales[d.name], (d) => (isNaN(d) ? d : d * 1)),
  }));

  const filtered = NAME
    ? transformed.filter((d) => d.name === NAME)
    : transformed;

  if (NAME && filtered.length === 0) {
    console.error(`No item matched name: ${NAME}`);
  }

  return Promise.all(
    // 可用 SHARE_START / SHARE_END 控制範圍，便於逐項調整
    filtered.slice(START, END).map((d) =>
      createOg(d).catch((e) => {
        console.log(d.id, d.name);
        console.error(e);
      })
    )
  ).then(() => {
    process.exit(0);
  });
});
