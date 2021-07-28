import React, { useRef, useEffect, forwardRef } from 'react'
import loadable from '@loadable/component'

import Box from '../components/Box'
const Lottie = loadable.lib(() => import('lottie-web'))

const faces = [
  require('./faces/face1.json'),
  require('./faces/face2.json'),
  require('./faces/face3.json'),
  require('./faces/face4.json'),
  require('./faces/face5.json'),
]

const Face = forwardRef(({ id, transform, className }, ref) => {
  const faceRef = useRef()
  const lottieRef = useRef()
  useEffect(() => {
    let ani
    let iter = 0
    const doAnimate = () => {
      if (lottieRef.current || window.lottie) {
        window.lottie = window.lottie || lottieRef.current.default
        if (!ani) {
          ani = window.lottie.loadAnimation({
            container: ref ? ref.current : faceRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: Object.assign({}, faces[id - 1]),
          });
        }
      } else if (iter < 10) {
        setTimeout(doAnimate, 500)
      }
      iter += 1
    }
    setTimeout(doAnimate)
    return () => {
      if (ani) ani.destroy()
    }
  }, [])
  return (
    <>
      <Box.AbsCenter ref={ref || faceRef} transform={transform} className={className} />
      <Lottie ref={lottieRef} />
    </>
  )
})

export default Face
