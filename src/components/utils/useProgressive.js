import { useEffect, useState } from 'react';

import useWebpImage from './useWebpImage';

const useProgressive = (srcArr, progressive) => {
  const [toLoad, setToLoad] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const picToLoad = useWebpImage(progressive ? srcArr[toLoad] : srcArr)
  const picLoaded = useWebpImage(progressive ? srcArr[loaded] : srcArr)
  useEffect(() => {
    if (progressive) {
      const img = new Image()
      img.onload = () => {
        setLoaded(toLoad)
        if (srcArr[toLoad + 1]) {
          setToLoad(toLoad + 1)
        }
      }
      img.src = picToLoad
    }
  }, [toLoad, picToLoad, srcArr, progressive])
  return progressive ? picLoaded : picToLoad
}

export default useProgressive
