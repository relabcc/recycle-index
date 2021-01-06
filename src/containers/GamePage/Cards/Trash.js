import { forwardRef } from '@chakra-ui/react'
import React, { useMemo } from 'react'

import Box from '../../../components/Box'
import Image from '../../../components/Image'

import imgSize from '../../TrashPage/data/imgSize'

const Trash = forwardRef(({ layers, ...props }, ref) => {

  const transofrm = useMemo(() => {
    if (!layers[0].height) return {}
    const minWidth = imgSize[0] * 0.3
    let scale = Math.max(1, minWidth / layers[0].width)
    const maxHeight = imgSize[0] * 0.6
    scale = Math.min(scale, maxHeight / layers[0].height)
    const layerCenter = [
      layers[0].x * 1 + layers[0].width / 2,
      layers[0].y * 1 + layers[0].height / 2
    ]
    const translate = [
      (imgSize[0] / 2 - layerCenter[0]) / imgSize[0] * 100 / scale,
      (imgSize[1] / 2 - layerCenter[1]) / imgSize[1] * 100 / scale,
    ]
    return {
      transform: `scale(${scale}) translate(${translate.map(p => `${p}%`)})`,
      transformOrigin: [
        layerCenter[0] / imgSize[0] * 100,
        layerCenter[1] / imgSize[1] * 100,
      ].map(s => `${s}%`).join(' '),
    }
  }, [layers])
  return (
    <Box overflow="hidden" bg="white" {...props} ref={ref}>
      {layers.map((layer, i) => (
        <Box.AbsCenter width="100%" key={i}>
          <Box {...transofrm}>
            <Image src={layer.src} pointerEvents="none" />
          </Box>
        </Box.AbsCenter>
      ))}
    </Box>
  )
})

export default Trash
