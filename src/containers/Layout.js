import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import theme from '../components/ThemeProvider/theme';
import headerContext from '../contexts/header/context'

import Header from './Header'

const Layout = ({ children }) => {
  const { hideHeader, headerBg } = useContext(headerContext)
  return (
    <StaticQuery
      query={graphql`
        query HeadingQuery {
          site {
            siteMetadata {
              title
              url
            }
          }
        }
      `}
      render={data => (
        <>
          <Helmet
            defaultTitle={data.site.siteMetadata.title}
            titleTemplate={`${data.site.siteMetadata.title}｜%s`}
          >
            <meta charSet="utf-8" />
            <meta
              name="description"
              content="寶特瓶回收瓶蓋要分開嗎？PLA是什麼？資源回收這麼難，回收大百科讓你懂分、懂丟、懂垃圾。"
            />
            <meta name="og:image" content={`${data.site.siteMetadata.url}/og.jpg`} />
          </Helmet>
          {!hideHeader && <Header height={theme.headerHeight} bg={headerBg} />}
          {children}
        </>
      )}
    />
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
