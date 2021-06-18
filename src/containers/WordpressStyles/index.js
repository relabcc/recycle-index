import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'

// import './style.css'

const injectCSS = (cssLink, id) => {
  let tag = document.getElementById(id)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('id', id)
  }
  tag.href = cssLink
  tag.rel = 'stylesheet'
  document.head.appendChild(tag)
  return () => {
    tag.remove()
  }
}

const WordpressStyles = ({ children }) => {
  useEffect(() => {
    return injectCSS('/revelar/style.css', 'revelar-styles-css')
  }, [])
  return (
    <Helmet>
      <link
        rel="stylesheet"
        id="wp-block-library-css"
        href={`${process.env.GATSBY_WORDPRESS_URL}/wp-includes/css/dist/block-library/style.min.css`}
        type="text/css"
        media="all"
      />
      {/* <link
        rel="stylesheet"
        id="genericons-css"
        href="/revelar/genericons/genericons.css"
        type="text/css"
        media="all"
      /> */}
      {/* <link
        rel="stylesheet"
        id="revelar-styles-css"
        href={`${process.env.GATSBY_WORDPRESS_URL}/wp-content/themes/revelar-child/style.css`}
        type="text/css"
        media="all"
      /> */}
      {children}
    </Helmet>
  )
}

export default WordpressStyles
