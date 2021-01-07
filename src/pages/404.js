import { navigate } from "gatsby"
import * as React from "react"

// markup
const NotFoundPage = () => {
  React.useEffect(() => {
    navigate('/')
  }, [])
  return (
    <div />
  )
}

export default NotFoundPage
