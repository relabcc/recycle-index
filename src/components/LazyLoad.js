import React, { useRef } from 'react'
import { useIsVisible } from 'react-is-visible'

import Box from './Box'

const LazyLoad = ({ ratio, children, ...props }) => {
  const ref = useRef()
  const isVisible = useIsVisible(ref, { once: true })
  return (
    <Box ref={ref} {...props}>
      {isVisible ? children : (ratio && <Box pt={`${100 / ratio}%`} />)}
    </Box>
  )
}

export default LazyLoad
