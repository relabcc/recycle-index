import { fromPairs, get, groupBy, mapKeys, mapValues } from 'lodash'

import cfg from './cfg.json'
import dd from './data.json'
import scale from './scale.json'

import images from './images'
import { useMemo } from 'react'

// https://docs.google.com/spreadsheets/d/1TlGNBNi3JHkuuyql7ruVbFI6bfIxyvHC3AWZ0HrMWhE/edit#gid=0
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

// const gridKeys = {
//   '品項': 'name',
//   '比例': 'size',
// }

// https://docs.google.com/spreadsheets/d/1qx-om_yU_8cIwDyp5pliiixTXiyhDV9Nok4Fd3h7be8/edit#gid=0
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
}

const remapKeys = (data, keyMap) => data.map((dd) => mapValues(mapKeys(dd, (v, k) => keyMap[k] || k), (v, k) => transformer[k] ? transformer[k](v) : v))

// const requestIfNotCached = (req, url) => new Promise(res => {
//   const KEY = `_CACHE_${url}]`
//   if (window[KEY]) {
//     res(window[KEY])
//   } else {
//     req(url).then(data => {
//       window[KEY] = data
//       res(data)
//     })
//   }
// })

const useData = () => {
  // const [data, setData] = useState()
  // window._RECYCLE_JSON = scale
  const grouped = groupBy(remapKeys(cfg, cfgKeys), 'name')
  const scales = scale.reduce((all, d) => {
    all[d.name] = d
    return all
  }, {})
  // const gridTransformed = remapKeys(grid, gridKeys).reduce((all, g) => {
  //   all[g.name] = g.size
  //   return all
  // }, {})
  const transformed = remapKeys(dd, dataKeys).filter(d => d.id).map(d => ({
    ...d,
    // size: gridTransformed[d.name],
    parts: grouped[d.name],
    img: get(images, [d.name, d.name]),
    transform: mapValues(scales[d.name], d => isNaN(d) ? d : d * 1),
  }))
  return useMemo(() => [{}, ...transformed], [])
  // return data
}

export default useData
