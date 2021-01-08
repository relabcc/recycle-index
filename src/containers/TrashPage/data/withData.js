import React, { createElement, useMemo } from 'react';
import { groupBy, reduce, size } from 'lodash'
import { Helmet } from 'react-helmet';

import useData from './useData';
import images from './images'
import imgSize from './imgSize'
import withLoading from '../../withLoading';

const withData = SubComp => props => {
  const { pageContext: { id } } = props
  const allData = useData()
  const data = useMemo(() => {
    if (!allData) return null
    const index = id * 1
    const ordered = allData[index].parts.sort((a, b) => a.layerOrder - b.layerOrder).map((cfg, index) => ({
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
    return {
      ...allData[index],
      totalHeight,
      xRange,
      centeroid,
      positions,
      partsCount,
      imgs: ordered.map(o => {
        if (o.partName) {
          namedPartCount += 1
          o.side = namedPartCount % 2
        }
        return {
          ...o,
          partName: partsCount === 1 ? allData[index].name : o.partName,
          src: images[allData[index].name][o.layerName || o.name],
        }
      }),
    }
  }, [allData, id])
  return (
    <>
      <Helmet>
        <title>{`#${data.id} ${data.name}`}</title>
        <meta name="og:image" content={`${props.data.site.siteMetadata.url}/share/${data.id}.jpg`} />
      </Helmet>
      {createElement(withLoading(data.imgs.map(d => d.src))(SubComp), {
        key: id,
        ...props,
        trashData: data,
        allData,
      })}
    </>
  )
}

export default withData