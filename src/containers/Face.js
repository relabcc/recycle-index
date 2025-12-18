import React, { useRef, useEffect, forwardRef } from "react";
// import loadable from '@loadable/component'
import useSWR from "swr";

import Box from "../components/Box";
// const Lottie = loadable.lib(() => import('lottie-web'))

const Face = forwardRef(({ id, transform, className }, ref) => {
  // Only fetch if id is a valid face number (1-5)
  const isValidId = id && (id === 1 || id === 2 || id === 3 || id === 4 || id === 5 || id === "1" || id === "2" || id === "3" || id === "4" || id === "5");
  const { data: animationData } = useSWR(isValidId ? `/faces/face${id}.json` : null);
  const faceRef = useRef();
  // const lottieRef = useRef()
  useEffect(() => {
    let ani;
    if (animationData) {
      let iter = 0;
      const doAnimate = () => {
        if (window.lottie) {
          // window.lottie = window.lottie || lottieRef.current.default
          if (!ani) {
            ani = window.lottie.loadAnimation({
              container: ref ? ref.current : faceRef.current,
              renderer: "svg",
              loop: true,
              autoplay: true,
              animationData,
            });
          }
        } else if (iter < 10) {
          setTimeout(doAnimate, 500);
        }
        iter += 1;
      };
      setTimeout(doAnimate);
    }
    return () => {
      if (ani) ani.destroy();
    };
  }, [animationData]);
  return (
    <Box.AbsCenter
      ref={ref || faceRef}
      transform={transform}
      className={className}
    />
  );
});

export default Face;
