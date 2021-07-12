import React, { useMemo } from 'react';
import { useWindowSize } from 'react-use';
import { Global, css } from '@emotion/react'

import Context from './context'
import { mediaBreak } from '../../components/ThemeProvider/theme';

const Provider = ({ children }) => {
  const windowSize = useWindowSize()
  const fontSize = useMemo(() => (windowSize.width < mediaBreak.tablet ? 16 : Math.round(Math.min(windowSize.width, 1920) / 80)) + 'px', [windowSize.width])
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
