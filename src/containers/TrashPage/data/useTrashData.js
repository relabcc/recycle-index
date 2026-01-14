import { useMemo } from 'react';
import imgSize from './imgSize'
import { groupBy, reduce, size } from 'lodash'

const useTrashData = (srcData, gatsbyImages, articles = [], oceanTrashList = []) => {
  const data = useMemo(() => {
    if (!srcData) return null
    // const index = id * 1
    const ordered = srcData.parts
      .sort((a, b) => {
        const orderDiff = Number(a.order) - Number(b.order);
        return orderDiff !== 0
          ? orderDiff
          : Number(a.layerOrder) - Number(b.layerOrder);
      })
      .map((cfg, index) => ({
      ...cfg,
      index,
      order: cfg.order - 1,
      centeroid: [
        cfg.x ? cfg.x * 1 + cfg.width / 2 : imgSize[0] / 2,
        cfg.y ? cfg.y * 1 + cfg.height / 2 :  imgSize[1] / 2,
      ],
    }))
    const positions = []
    const yRange = ordered.reduce((all, cfg) => {
      const top = cfg.y ? cfg.y * 1 : 0
      const bottom = cfg.height ? (top + cfg.height * 1) : imgSize[1]
      return [Math.min(all[0], top), Math.max(all[1], bottom)]
    }, [Infinity, 0])
    const xRange = ordered.reduce((all, cfg) => {
      const left = cfg.x ? cfg.x * 1 : 0
      const right = cfg.width ? (left + cfg.width * 1) : imgSize[1]
      return [Math.min(all[0], left), Math.max(all[1], right)]
    }, [Infinity, 0])
    const centeroid = yRange[0] + yRange[1] / 2
    const grouped = groupBy(ordered, 'order')
    const totalHeight = reduce(grouped, (total, orderEle, order) => {
      const y = total + (orderEle[0].height ? orderEle[0].height * 1 : imgSize[1])
      positions[order] = y
      return y
    }, 0)
    const partsCount = size(grouped)
    let namedPartCount = 0

    // 匹配 articles 數據
    const matchedArticle = articles.find(article => article.垃圾 === srcData.name)

    const additional = (srcData.additional && srcData.additional !== '')
      ? srcData.additional
      : null

    const article = matchedArticle ? {
      text: matchedArticle.文案,
      url: matchedArticle.文章
    } : null

    // 匹配 ocean-trash 數據
    const matchedOceanTrash = oceanTrashList.find(item => item.回百垃圾 === srcData.name)

    const oceanTrash = matchedOceanTrash ? {
      name: matchedOceanTrash.海廢map,
      url: matchedOceanTrash.URL,
      gatsbyImg: matchedOceanTrash.gatsbyImg
    } : null


    return {
      ...srcData,
      totalHeight,
      xRange,
      centeroid,
      positions,
      partsCount,
      additional,
      article,
      oceanTrash,
      gatsbyImg: gatsbyImages[srcData.name],
      imgs: ordered.map(o => {
        if (o.partName) {
          namedPartCount += 1
          o.side = namedPartCount % 2
        }
        return {
          ...o,
          partName: partsCount === 1 ? srcData.name : o.partName,
          // src: images[srcData.name][o.layerName || o.name],
          gatsbySrc: gatsbyImages[o.layerName || o.name]?.large,
        }
      }),
    }
  }, [srcData, gatsbyImages, articles, oceanTrashList])

  return data
}

export default useTrashData
