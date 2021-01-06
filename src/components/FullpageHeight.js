import React, { forwardRef, useContext } from 'react';
import { useWindowSize } from 'react-use';

import Box from './Box'
import theme from './ThemeProvider/theme'
import headerContext from '../contexts/header/context'
import useResponsive from '../contexts/mediaQuery/useResponsive'

const Fullpage = forwardRef(({ children, ...props }, ref) => {
  const { hideHeader } = useContext(headerContext)
  const { getCurrentValue } = useResponsive()
  const headerHeight = getCurrentValue(theme.headerHeight)
  const windowSize = useWindowSize()
  return (
    <Box
      height={`${windowSize.height}px`}
      mt={!hideHeader && (!props.position || props.position === 'relative') && `-${headerHeight}`}
      pt={!hideHeader && headerHeight}
      top={!hideHeader && props.position === 'fixed' && headerHeight}
      ref={ref}
      {...props}
    >
      {children}
    </Box>
  )
});

export default Fullpage;
