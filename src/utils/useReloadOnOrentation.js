import { useEffect, useRef } from 'react'

const useReloadOnOrentation = () => {
  const prevOri = useRef()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onorientationchange = (event) => {
        const thisOrientation = event.target.screen.orientation ? event.target.screen.orientation.type : (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
        if (typeof prevOri.current) {
          if (prevOri.current !== thisOrientation) {
            setTimeout(() => window.location.reload())
          }
        }
        prevOri.current = thisOrientation
      };
    }
  }, [])
}

export default useReloadOnOrentation
