const { fromPairs, mapValues, mapKeys, groupBy } = require("lodash")

const cfgKeys = {
  '垃圾名稱': 'name',
  '圖層順序': 'layerOrder',
  '拆解排序': 'order',
  '圖層H高度': 'height',
  '圖層W寬度': 'width',
  '圖層Y位置': 'y',
  '圖層X位置': 'x',
  '圖層名稱': 'layerName',
  '對應部分/材質': 'partName',
  '納入題庫': 'inGame',
}

const dataKeys = {
  '最終序號': 'id',
  '品項': 'name',
  '可分解為哪些部分/材質（for網站）': 'partsDetail',
  '同義詞': 'synonym',
  '回收前使用者應做什麼處理': 'handling',
  '處理後應該丟哪一類?': 'belongsTo',
  '使用場域': 'places',
  '各縣市回收狀況': 'recyclable',
  '回收率': 'recycleRate',
  '資源化比例': 'resourceRate',
  '文案': 'description',
  '標籤': 'recycleValue',
  '回收狀況': 'recycleStatus',
  '祝福文案': 'share',
  '材質備註': 'partsNote',
  '處理步驟備註': 'recycleNote',
  '使用建議（替代方案）': 'alternative',
  '贊助商': 'sponsor',
  '補充說明': 'additional',
  '新品': 'isNew',
  'SEO標題': 'seoTitle',
  'SEO敘述': 'seoDescription',
}

const lineParser = d => {
  const lines = d.replace(/\n|、\n/g, '\n').split('\n')
  return fromPairs(lines.map(l => l.split('-').map(w => w.replace(/\|/g, '\n'))))
}

const rateParser = d => {
  const lines = d.split('\n')
  return fromPairs(lines.reduce((all, l) => {
    const splitted = l.split('：')
    return [...all, [splitted[0], Math.round(parseFloat(splitted[1]))], [`${splitted[0]}*`, Math.round(parseFloat(splitted[1]))]]
  }, []))
}

const transformer = {
  partsDetail: lineParser,
  belongsTo: lineParser,
  recycleRate: rateParser,
  resourceRate: rateParser,
  handling: d => d.split('、').filter(d => d !== '-'),
  places: d => typeof d  === 'number' ? [d] : d.split(','),
  synonym: d => d.split('、'),
  size: d => d.split('x').map(Number),
  isNew: d => d === 'TRUE',
}

const remapKeys = (data, keyMap) => data.map((dd) => mapValues(mapKeys(dd, (v, k) => keyMap[k] || k), (v, k) => transformer[k] ? transformer[k](v) : v))

module.exports = (data, scale = [], cfg = []) => {
  const grouped = groupBy(remapKeys(cfg, cfgKeys), 'name')
  const scales = scale.reduce((all, d) => {
    all[d.name] = d
    return all
  }, {})
  const transformed = remapKeys(data, dataKeys).filter(d => d.id).map(d => ({
    ...d,
    parts: grouped[d.name],
    transform: mapValues(scales[d.name], d => isNaN(d) ? d : d * 1),
  }))
  return [{}, ...transformed]
}
