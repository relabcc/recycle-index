import React, { useMemo } from 'react'
import { graphql, Link } from "gatsby"
import { AspectRatio, Text, Box } from '@chakra-ui/react'
import { unescape } from 'lodash'

import useShowHeader from '../contexts/header/useShowHeader'
import WordpressStyles from '../containers/WordpressStyles'
import GatsbyImageFallback from '../components/GatsbyImageFallback'
import theme from '../components/ThemeProvider/theme'

const Article = ({ post, isSticky }) => {
  const excerpt = useMemo(() => {
    const res = /<p>([^<]+)<\/p>/.exec(post.excerpt)
    return res ? unescape(res[1]) : ''
  }, [post.excerpt])

  return (
    <article className={`post type-post status-publish format-standard hentry ${isSticky ? 'sticky' : ''}`}>
      <div className="entry-thumbnail">
        <Link to={`/article/${post.databaseId}`}>
          {post.featuredImage?.node ? (
            <GatsbyImageFallback
              src={post.featuredImage.node}
              alt={post.featuredImage.node.altText}
              ratio={4 / 3}
            />
          ) : <AspectRatio ratio={4 / 3}><Box bg="gray.200" /></AspectRatio>}
        </Link>
      </div>
      <header className="entry-header">
        <h2 className="entry-title">
          <Link to={`/article/${post.databaseId}`}>{post.title}</Link>
        </h2>
        <div className="entry-meta">
          <Link to={`/article/${post.databaseId}`}>
            {excerpt}
          </Link>
        </div>
      </header>
    </article>
  )
}

const Articles = ({ data, pageContext: { nextPagePath, previousPagePath }}) => {
  const posts = data.allWpPost.nodes
  useShowHeader('colors.yellow')
  const [normalPosts, stickyPosts] = useMemo(() => posts.reduce((all, p) => {
    all[p.isSticky * 1].push(p)
    return all
  }, [[], []]), [posts])

  if (!posts.length) {
    return <Text>哎呀。找不到文章了</Text>
  }

  return (
    <>
      <WordpressStyles>
        <title>文章專區</title>
      </WordpressStyles>
      <Box pt={theme.headerHeight} />
      <div id="primary" className="content-area blog">
        <main id="main" className="site-main" role="main">
          <div id="posts-wrapper">
            {stickyPosts.map(post => (
              <Article post={post} key={post.id} isSticky />
            ))}
            {normalPosts.map(post => (
              <Article post={post} key={post.id} />
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

export default Articles

export const pageQuery = graphql`
  query WordPressPostArchive($offset: Int!, $postsPerPage: Int!) {
    allWpPost(
      sort: { fields: [date], order: DESC }
      limit: $postsPerPage
      skip: $offset
    ) {
      nodes {
        id
        databaseId
        excerpt
        uri
        date
        title
        isSticky
        featuredImage {
          node {
            srcSet
            altText
            localFile {
              childImageSharp {
                gatsbyImageData(layout: FULL_WIDTH)
              }
            }
          }
        }
      }
    }
  }
`
