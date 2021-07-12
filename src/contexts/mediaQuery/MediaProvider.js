import React from 'react';
import { useMedia } from 'react-use';

import MediaContext from './mediaContext'

import { breakpoints } from '../../components/ThemeProvider/theme';

const useBreakPoint = (bp) => useMedia(`(min-width: ${bp}px)`);

const useAllBreakpoints = () => breakpoints.slice(1).map(useBreakPoint)

const MediaQuery = ({ children }) => {
  const responsive = useAllBreakpoints()
  return (
    <MediaContext.Provider value={responsive}>
      {children}
    </MediaContext.Provider>
  )
}

export default MediaQuery;
