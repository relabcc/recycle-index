import { useMemo } from 'react';
import { get, isArray } from 'lodash'

import isIos from './isIos'

const useWebpImage = (src) => {
  const canUseWebp = typeof window === 'undefined' ? false : get(window, 'Modernizr.webp')
  const pic = useMemo(() => {
    if (!isArray(src)) return src
    return canUseWebp && !isIos ? src[0] : src[1];
  }, [canUseWebp, src])

  return pic
}

export default useWebpImage
