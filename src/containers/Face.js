import React, { useRef, useEffect } from 'react'
import lottie from 'lottie-web'
import { random } from 'lodash'

import Box from '../components/Box'
import { forwardRef } from '@chakra-ui/react'

const Face = forwardRef(({ id, transform, className }, ref) => {
  const faceRef = useRef()
  useEffect(() => {
    const ani = lottie.loadAnimation({
      container: ref ? ref.current : faceRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: `/faces/face${id || (random(4) + 1)}.json`,
    });
    return () => {
      ani.destroy()
    }
  }, [])
  return (
    <Box.AbsCenter ref={ref || faceRef} transform={transform} className={className} />
  )
})

export default Face
