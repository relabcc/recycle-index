import React, { useContext, useMemo, createContext } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import theme from '../components/ThemeProvider/theme';
import headerContext from '../contexts/header/context'

import Header from './Header'

export const EnContext = createContext()

const description = [
  '寶特瓶回收瓶蓋要分開嗎？PLA是什麼？資源回收這麼難，回收大百科讓你懂分、懂丟、懂垃圾。',
  'Do you separate the lid when recycling plastic bottle? What is PLA? Recycle Index - 101 Must-Know Trashes in Taiwan gives you instruction on how to better recycle.',
]

const Layout = ({ children, path }) => {
  const isEn = useMemo(() => /^\/en/.test(path), [path])
  const { hideHeader, headerBg } = useContext(headerContext)
  return (
    <StaticQuery
      query={graphql`
        query HeadingQuery {
          site {
            siteMetadata {
              title
              titleEn
              siteUrl
            }
          }
        }
      `}
      render={data => (
        <>
          <Helmet
            defaultTitle={data.site.siteMetadata[`title${isEn ? 'En' : ''}`]}
            titleTemplate={`%s｜${data.site.siteMetadata[`title${isEn ? 'En' : ''}`]}`}
          >
            <meta charSet="utf-8" />
            <meta
              name="description"
              content={description[isEn ? 1 : 0]}
            />
            <meta name="og:image" content={`${data.site.siteMetadata.siteUrl}/og-0113.jpg`} />
          </Helmet>
          <EnContext.Provider value={isEn}>
            {!hideHeader && <Header height={theme.headerHeight} bg={headerBg} isEn={isEn} />}
            {children}
          </EnContext.Provider>
        </>
      )}
    />
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
