const fs = require("fs");
const fse = require("fs-extra");
const Rematrix = require('rematrix')

const { get, mapValues, mapKeys } = require("lodash");
const path = require("path");
const util = require("util");
const { registerFont, createCanvas, loadImage } = require("canvas");

const images = require("./src/images/index.png");
// const writeFile = util.promisify(fs.writeFile);

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

const readfile = util.promisify(fs.readFile);

const parseTransform = (transform) => {
  const pttn = /(\w+)\(([^)]+)\)/g
  const getNumber = /-?\d+(\.\d)*/g
  let t = [
    Rematrix.translate(imgSize[0] / 2, imgSize[1] / 2)
  ]
  const obj = {}
  // const unitify = {
  //   translate: pos => [
  //     pos[0] / 100 * imgSize[0],
  //     pos[1] / 100 * imgSize[1]
  //   ],
  //   // skew: rs => rs.map(r => r * Math.PI / 180),
  //   // rotate: r => r * Math.PI / 180,
  // }
  let pair
  while (pair = pttn.exec(transform)) {
    const [, name, cfg] = pair
    const cfgs = []
    let res
    while (res = getNumber.exec(cfg)) {
      cfgs.push(res)
    }
    if (cfgs.length > 1) {
      // const x = cfgs[0][0] * 1
      // const y = cfgs[1][0] * 1
      obj[name] = [
        cfgs[0][0] * 1,
        cfgs[1][0] * 1,
      ]
    } else {
      // t.push(Rematrix[name](cfgs[0][0] * 1))
      obj[name] = cfgs[0][0] * 1
    }
  }
  const mt = ['skew', 'rotate', 'scale'].map(key => {
    // const cfg = unitify[key] ? unitify[key](obj[key]) : obj[key]
    const cfg = obj[key]
    return Rematrix[key](...(Array.isArray(cfg) ? cfg : [cfg]))
  })

  const matrix = [
    ...t,
    ...mt,
    Rematrix.translate(-imgSize[0] / 2, -imgSize[1] / 2)
  ].reduce(Rematrix.multiply)
  return [matrix, obj]
  // return obj
}

// const getHtml = ({ id }) => `<!DOCTYPE html>
// <html lang="zh-Hant-TW">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <meta http-equiv="X-UA-Compatible" content="ie=edge">
//   <title>回收大百科</title>
//   <meta property="description" content="台灣人必懂的101件垃圾" />
//   <meta property="og:type" content="website" />
//   <meta property="og:title" content="回收大百科" />
//   <meta property="og:description" content="台灣人必懂的101件垃圾" />
//   <meta property="og:image" content="https://recycle.rethinktw.org/share/${id}/share.png" />
//   <meta property="og:image:width" content="1200" />
//   <meta property="og:image:height" content="630" />
// </head>
// <body>
//   <img src="share.png" style="display: none" />
//   <script>
//     window.onload = function() {
//       window.location = "https://recycle.rethinktw.org/";
//     };
//   </script>
// </body>
// </html>
// `

const getFaceImage = async data => {
  const face = await loadImage(path.resolve(__dirname, `faces/face${data.transform.faceNo}.svg`))
  const canvas = createCanvas(...imgSize);
  const ctx = canvas.getContext('2d');
  const [faceTransform, transformCfg] = parseTransform(data.transform.face.trim())
  const matrix = [
    faceTransform[0],
    faceTransform[1],
    faceTransform[4],
    faceTransform[5],
    faceTransform[12],
    faceTransform[13],
  ]

  // ctx.translate(imgSize[0] / 2, imgSize[1] / 2)
  ctx.transform(...matrix)
  // ctx.translate(...faceTransform.translate)
  // ctx.rotate(faceTransform.rotate * Math.PI / 180)
  // ctx.transform(
  //   faceTransform.scale,
  //   faceTransform.skew[0] * Math.PI / 180,
  //   faceTransform.skew[1] * Math.PI / 180,
  //   faceTransform.scale,
  //   faceTransform.translate[0] / 100 * imgSize[0] * faceTransform.scale,
  //   faceTransform.translate[1] / 100 * imgSize[1] * faceTransform.scale,
  // )
  ctx.drawImage(face, 0, 0, ...imgSize);
  // ctx.drawImage(face, 0, 0, ...imgSize);
  const dataURL = canvas.toDataURL()
  const dirName = path.resolve(__dirname, `public/share/${data.id}`)
  return new Promise(async resolve => {
    await fse.ensureDir(dirName)
    const savePng = fs.createWriteStream(path.resolve(dirName, 'face.png'))
    canvas.pngStream().pipe(savePng)

    savePng.on('close', async () => {
      const face = await loadImage(dataURL)
      resolve([face, transformCfg])
    })
  })
}

const createOg = async (data) => {
  if (!data.img) {
    throw new Error('no image')
  }
  const shape = await loadImage(
    path.resolve(__dirname, "src/containers/TrashPage/share-bg.svg")
  );
  const logo = await loadImage(
    path.resolve(__dirname, "src/containers/logo.svg")
  );
  const trash = await loadImage(fs.readFileSync(data.img));
  const [face, transformObj] = await getFaceImage(data)

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");
  // 填滿底圖
  ctx.fillStyle = colorsCfg[data.recycleValue];
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(logo, 1004, 583.5, 168, 27.8);
  ctx.drawImage(shape, 149, 57, 990.6, 538);
  const s = ((data.transform.shareScale || 100) / 100)
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
  ctx.translate(...transformOrigin);
  ctx.rotate(r);
  ctx.drawImage(trash, -trashSize[0] / 2, -trashSize[1] / 2, ...trashSize);
  ctx.drawImage(
    face,
    -trashSize[0] / 2 + trashSize[0] * transformObj.translate[0] / 100 * transformObj.scale,
    -trashSize[1] / 2 + trashSize[1] * transformObj.translate[1] / 100 * transformObj.scale,
    ...trashSize
  );

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

  const dirName = path.resolve(__dirname, `static/share`);
  await fse.ensureDir(dirName);
  return new Promise((resolve) => {
    const saveJpg = fs.createWriteStream(
      path.resolve(dirName, `${+data.id + 1}.jpg`)
    );
    canvas.createJPEGStream({
      quality: 0.95,
    }).pipe(saveJpg);

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
  const scales = scale.reduce((all, d) => {
    all[d.name] = d;
    return all;
  }, {});

  const transformed = remapKeys(data.filter(d => d['最終序號']), dataKeys).map((d) => ({
    ...d,
    img: get(images, [d.name, d.name].map(s => s.replace(/\//g, '%2F'))),
    transform: mapValues(scales[d.name], (d) => (isNaN(d) ? d : d * 1)),
  }));

  return Promise.all(
    transformed.slice(111).map((d) =>
      createOg(d).catch((e) => {
        console.log(d);
        console.error(e);
      })
    )
  ).then(process.exit);
});
