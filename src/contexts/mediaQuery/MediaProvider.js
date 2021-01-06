import React from 'react';

import { breakpoints } from '../../components/ThemeProvider/theme';
import MediaContext from './mediaContext'
import mqHook from './mqHook'

const MediaQuery = ({ children }) => {
  const q = breakpoints.map(mqHook)
  return (
    <MediaContext.Provider value={q}>
      {children}
    </MediaContext.Provider>
  )
}

export default MediaQuery;
