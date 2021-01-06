import React, { useState } from 'react';
import Measure from 'react-measure';

import Context from './context'
import Container from '../../components/Container';

const Provider = ({ children }) => {
  const [bound, setBound] = useState({})
  return (
    <>
      <Context.Provider value={{ containerWidth: bound.width }}>
        {children}
      </Context.Provider>
      <Measure bounds onResize={({ bounds }) => setBound(bounds)}>
        {({ measureRef }) => <Container ref={measureRef} />}
      </Measure>
    </>
  )
}

export default (Provider);
