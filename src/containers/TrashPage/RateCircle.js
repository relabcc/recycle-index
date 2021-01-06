import { CircularProgress } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'

const RateCircle = ({ value, color, className, ...props }) => {
  const [theValue, setValue] = useState(0)
  const ref = useRef()

  useEffect(() => {
    ref.current.addEventListener('progress', ({ progress }) => {
      setValue(progress * value)
    })
  }, [])
  return (
    <div className={className} ref={ref}>
      <CircularProgress
        value={theValue}
        size="100%"
        trackColor="transparent"
        color={color}
        {...props}
      />
    </div>
  )
}

export default RateCircle
