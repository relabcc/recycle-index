import React from 'react'

import MediaContext from './mediaContext'
import getResponsiveHelper from './getResponsiveHelper'

export default (WrappedComp) => props => (
  <MediaContext.Consumer>
    {q => (
      <WrappedComp
        {...props}
        {...getResponsiveHelper(q)}
      />
    )}
  </MediaContext.Consumer>
);
