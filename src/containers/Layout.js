import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import theme from '../components/ThemeProvider/theme';
import headerContext from '../contexts/header/context'

import Header from './Header'

const Layout = ({ children }) => {
  const { hideHeader, headerBg } = useContext(headerContext)
  return (
    <>
      {!hideHeader && <Header height={theme.headerHeight} siteTitle="回收大百科" bg={headerBg} />}
      {children}
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
