import { graphql } from 'gatsby'
import Page from '../containers/TrashPage'

export default Page

export const pageQuery = graphql`
  query TrashPageQuery {
    site {
      siteMetadata {
        url
      }
    }
  }
`
