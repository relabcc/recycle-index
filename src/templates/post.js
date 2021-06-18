import React, { useEffect, useMemo } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import { format } from "date-fns"
import { unescape } from "lodash"

import useShowHeader from "../contexts/header/useShowHeader"
import WordpressStyles from "../containers/WordpressStyles"

const Post = ({ data: { post, site: { siteMetadata: { url } } } }) => {
  const pageUrl = `${url}/article/${post.databaseId}`
  useShowHeader('colors.yellow')
  useEffect(() => {
    document.querySelectorAll('#main a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        try {
          document.getElementById(anchor.getAttribute('href').slice(1)).scrollIntoView({
            behavior: 'smooth'
          });
        } catch (e) {
          console.error(e)
        }
      });
    });
  }, [post])
  const excerpt = useMemo(() => {
    const res = /<p>([^<]+)<\/p>/.exec(post.excerpt)
    return res ? unescape(res[1]) : ''
  }, [post.excerpt])
  return (
    <>
      <WordpressStyles>
        <title>{post.title}</title>
        <meta name="description" content={excerpt} />
        {post.featuredImage && <meta name="og:image" content={post.featuredImage.node.sourceUrl} />}
      </WordpressStyles>
      <div id="content" className="site-content">
        <div id="primary" className="content-area">
          <main id="main" className="site-main" role="main">
            <article className="post type-post status-publish format-standard has-post-thumbnail hentry">
              <header className="entry-header">
                <span className="entry-format"></span>
                <h2 className="entry-title">
                  <a href={pageUrl} rel="bookmark">{post.title}</a>
                </h2>
                <div className="entry-meta">
                  <span className="posted-on">
                    <a href={pageUrl} rel="bookmark">
                      <time className="entry-date published" dateTime={post.date}>
                        {format(new Date(post.date), 'yyyy-MM-dd')}
                      </time>
                    </a>
                  </span>
                </div>
              </header>
              <div className="entry-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
          </main>
        </div>
      </div>
    </>
  )
}

Post.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Post

export const pageQuery = graphql`
  query BlogPostById(
    # these variables are passed in via createPage.pageContext in gatsby-node.js
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    # selecting the current post by id
    post: wpPost(id: { eq: $id }) {
      id
      databaseId
      excerpt
      content
      title
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
    # this gets us the previous post by id (if it exists)
    previous: wpPost(id: { eq: $previousPostId }) {
      uri
      title
    }
    # this gets us the next post by id (if it exists)
    next: wpPost(id: { eq: $nextPostId }) {
      uri
      title
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
