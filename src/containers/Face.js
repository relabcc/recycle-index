import React, { useRef, useEffect, forwardRef } from 'react'
import lottie from 'lottie-web'

import Box from '../components/Box'

const Face = forwardRef(({ id, transform, className }, ref) => {
  const faceRef = useRef()
  useEffect(() => {
    let ani
    setTimeout(() => {
      ani = lottie.loadAnimation({
        container: ref ? ref.current : faceRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `/faces/face${id || 1}.json`,
      });
    })
    return () => {
      if (ani) ani.destroy()
    }
  }, [id])
  return (
    <Box.AbsCenter ref={ref || faceRef} transform={transform} className={className} />
  )
})

export default Face
