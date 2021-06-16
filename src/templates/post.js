import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import { format } from "date-fns"
import { Helmet } from 'react-helmet'

import Layout from "../containers/Layout"

const Post = ({ data: { wpPost, site: { siteMetadata: { url } } } }) => {
  const pageUrl = `${url}/article${wpPost.uri}`
  console.log(wpPost)
  return (
    <Layout>
      <Helmet>
        <link
          rel="stylesheet"
          id="wp-block-library-css"
          href={`${process.env.GATSBY_WORDPRESS_URL}/wp-includes/css/dist/block-library/style.min.css?ver=5.7.2`}
          type="text/css"
          media="all"
        />
        <link
          rel="stylesheet"
          id="genericons-css"
          href={`${process.env.GATSBY_WORDPRESS_URL}/wp-content/themes/revelar/genericons/genericons.css?ver=3.3`}
          type="text/css"
          media="all"
        />
        <link
          rel="stylesheet"
          id="revelar-styles-css"
          href={`${process.env.GATSBY_WORDPRESS_URL}/wp-content/themes/revelar/style.css?ver=5.7.2`}
          type="text/css"
          media="all"
        />
     </Helmet>
      <div id="content" className="site-content">
        <div id="primary" className="content-area">
          <main id="main" className="site-main" role="main">
            <article className="post type-post status-publish format-standard has-post-thumbnail hentry">
              <header className="entry-header">
                <span className="entry-format"></span>
                <h2 className="entry-title">
                  <a href={pageUrl} rel="bookmark">{wpPost.title}</a>
                </h2>
                <div className="entry-meta">
                  <span className="posted-on">
                    <a href={pageUrl} rel="bookmark">
                      <time className="entry-date published" dateTime={wpPost.date}>
                        {format(new Date(wpPost.date), 'yyyy-MM-dd')}
                      </time>
                    </a>
                  </span>
                </div>
              </header>

              <div className="entry-thumbnail">
                <img
                  width="1200"
                  height="800"
                  className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                  alt=""
                  loading="lazy"
                  srcSet={wpPost.featuredImage?.node.srcSet}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>
              <div className="entry-content" dangerouslySetInnerHTML={{ __html: wpPost.content }} />
            </article>
          </main>
        </div>
      </div>
    </Layout>
  )
}

Post.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Post

export const postQuery = graphql`
  query($id: String!) {
    wpPost(id: { eq: $id }) {
      title
      content
      date
      uri
      featuredImage {
        node {
          srcSet
        }
      }
    }
    site {
      siteMetadata {
        title
        description
        url
      }
    }
  }
`
