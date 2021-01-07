import { useMemo } from 'react';
import { get, isArray } from 'lodash'

import isIos from './isIos'

export const getImage = (src) => {
  const canUseWebp = typeof window === 'undefined' ? false : get(window, 'Modernizr.webp')
  if (!isArray(src)) return src
  return canUseWebp && !isIos ? src[0] : src[1];
}

const useWebpImage = (src) => {
  const pic = useMemo(() => getImage(src), [src])

  return pic
}

export default useWebpImage
