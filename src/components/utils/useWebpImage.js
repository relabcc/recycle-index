import { useMemo } from 'react';
import { get, isArray } from 'lodash'

import isIos from './isIos'

export const getImage = (src) => {
  const canUseWebp = typeof window === 'undefined' ? false : get(window, 'Modernizr.webp')
  if (!isArray(src)) return src?.default || src
  const img = canUseWebp && !isIos ? src[0] : src[1]
  return img?.default || img;
}

const useWebpImage = (src) => {
  const pic = useMemo(() => getImage(src), [src])

  return pic
}

export default useWebpImage
