import { useContext, useEffect } from "react"

import context from './context'

const useShowHeader = (bg) => {
  const { setHideHeader, setHeaderBg } = useContext(context)
  useEffect(() => {
    setHideHeader(false)
    setHeaderBg(bg)
    return () => {
      setHideHeader(true)
      setHeaderBg(null)
    }
  }, [])
}

export default useShowHeader
