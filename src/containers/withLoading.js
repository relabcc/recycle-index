import React, { useEffect, useState } from 'react'

import FullpageLoading from '../components/FullpageLoading'
import imageLoader from './imageLoader'

const withLoading = (images) => Comp => props => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    imageLoader(images).then(() => setLoading(false))
  }, [])

  return (
    <>
      {loading && <FullpageLoading />}
      <Comp {...props} />
    </>
  )
}

export default withLoading
