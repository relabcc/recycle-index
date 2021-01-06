import React, { useState } from 'react';

import Context from './context'

const Provider = ({ children }) => {
  const [hideHeader, setHideHeader] = useState(true)
  const [headerBg, setHeaderBg] = useState()
  return (
    <Context.Provider value={{ hideHeader, setHideHeader, headerBg, setHeaderBg }}>
      {children}
    </Context.Provider>
  )
}

export default Provider;
