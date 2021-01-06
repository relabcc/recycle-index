import React, { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import { Global, css } from '@emotion/react'
import Bowser from 'bowser';

import Context from './context'
// import useResponsive from '../mediaQuery/useResponsive';

let browser
if (typeof window !== 'undefined') {
  browser = Bowser.getParser(window.navigator.userAgent);
}

const Provider = ({ children }) => {
  const windowSize = useWindowSize()
  const [windowWidth, setWindowWidth] = useState(windowSize.width)
  useEffect(() => {
    if (browser && browser.getPlatformType() === 'desktop') {
      setWindowWidth(windowSize.width)
    }
  }, [windowSize.width])
  // const { isMobile } = useResponsive()
  const fontSize = Math.round(Math.min(windowWidth, 1920) / 80) + 'px'
  return (
    <>
      <Context.Provider value={{ fontSize }}>
        {children}
      </Context.Provider>
      <Global styles={css`html, body { font-size: ${fontSize}; }`} />
    </>
  )
}

export default Provider;
