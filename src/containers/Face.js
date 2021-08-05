import React, { useRef, useEffect, forwardRef } from 'react'
import loadable from '@loadable/component'
import useSWR from 'swr'
import { withPrefix } from 'gatsby'

import Box from '../components/Box'
const Lottie = loadable.lib(() => import('lottie-web'))

const Face = forwardRef(({ id, transform, className }, ref) => {
  const { data: animationData } = useSWR(withPrefix(`/faces/face${id}.json`))
  const faceRef = useRef()
  const lottieRef = useRef()
  useEffect(() => {
    let ani
    if (animationData) {
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
              animationData,
            });
          }
        } else if (iter < 10) {
          setTimeout(doAnimate, 500)
        }
        iter += 1
      }
      setTimeout(doAnimate)
    }
    return () => {
      if (ani) ani.destroy()
    }
  }, [animationData])
  return (
    <>
      <Box.AbsCenter ref={ref || faceRef} transform={transform} className={className} />
      <Lottie ref={lottieRef} />
    </>
  )
})

export default Face
