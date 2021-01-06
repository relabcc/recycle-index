import { useContext, useEffect } from "react"

import context from './context'

const useHideHeader = () => {
  const { setHideHeader } = useContext(context)
  useEffect(() => {
    setHideHeader(true)
    return () => setHideHeader(false)
  }, [])
}

export default useHideHeader
