import { useContext, useEffect } from 'react'
import context from './context'

const headerControl = noHeader => Page => props => {
  const { setHideHeader } = useContext(context)
  useEffect(() => {
    setHideHeader(noHeader)
  }, [])

  return <Page {...props} />
}

export default headerControl
