import React, { useRef, useEffect, forwardRef } from 'react'
import lottie from 'lottie-web'

import Box from '../components/Box'

const faces = [
  require('./faces/face1.json'),
  require('./faces/face2.json'),
  require('./faces/face3.json'),
  require('./faces/face4.json'),
  require('./faces/face5.json'),
]

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
        animationData: Object.assign({}, faces[id - 1]),
      });
    })
    return () => {
      if (ani) ani.destroy()
    }
  }, [id])
  return <Box.AbsCenter ref={ref || faceRef} transform={transform} className={className} />
})

export default Face
