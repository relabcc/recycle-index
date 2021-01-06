import React, { useMemo, forwardRef } from 'react'
import isArray from 'lodash/isArray'
import last from 'lodash/last'
import { Image } from "@chakra-ui/react";

import useProgressive from './utils/useProgressive';
import isIos from './utils/isIos';

const mimeTypes = {
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  tiff: 'image/tiff',
  tif: 'image/tiff',
  webp: 'image/webp',
}

const base64Mime = /data:(\w+\/\w+);base64/

const ReImage = forwardRef(({ src, alt, progressive, ...props }, ref) => {
  const pSrc = useProgressive(src, progressive)

  const pic = useMemo(() => {
    if (!isArray(src) || progressive) return null

    const sources = src.map((srcSet) => {
      const mime = base64Mime.exec(srcSet)
      const type = mime ? mime[1] : mimeTypes[last(srcSet.split('.'))]
      return {
        srcSet,
        type,
      }
    })
    return {
      sources,
      fallback: last(src),
    }
  }, [src, progressive])
  if (isArray(src) && !progressive) {
    if (isIos) return <Image src={pic.fallback} alt={alt} {...props} ref={ref} />
    return (
      <Image as="picture"{...props}  ref={ref}>
        {pic.sources.map((s, i) => <source key={i} {...s} />)}
        <img src={pic.fallback} alt={alt} />
      </Image>
    )
  }

  return <Image src={pSrc} alt={alt} {...props} ref={ref} />
})

ReImage.defaultProps = {
  width: '100%',
};

ReImage.displayName = 'ReImage';

export default ReImage;
