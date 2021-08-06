import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'

import Page from '../containers/HomePage'
import handleGatsbyImage from '../utils/handleGatsbyImage'

const Render = (props) => {
  const gatsbyImages = useMemo(() => handleGatsbyImage(props.data.allFile), [props.data.allFile])
  return (
    <>
      <Helmet>
        <title>秒懂101個台灣人必知的垃圾</title>
      </Helmet>
      <Page gatsbyImages={gatsbyImages} {...props} />
    </>
  )
}

export default Render

export const query = graphql`
  query HomePageQuery($nameSearch: String!) {
    allFile(filter: {relativePath: {regex: $nameSearch}}) {
      edges {
        node {
          name
          relativeDirectory
          childImageSharp {
            regular: gatsbyImageData(
              placeholder: BLURRED
              layout: FULL_WIDTH
              breakpoints: [256, 512]
            )
          }
        }
      }
    }
    mountTopMd: file(relativePath: { eq: "mount-top@2x.png" }) {
      childImageSharp {
        gatsbyImageData(
          width: 2560
          placeholder: NONE
          layout: FIXED
        )
      }
    }
    mountTopLg: file(relativePath: { eq: "mount-top@2x.png" }) {
      childImageSharp {
        gatsbyImageData(
          width: 3400
          placeholder: NONE
          layout: FIXED
        )
      }
    }
    mountBottomMd: file(relativePath: { eq: "mount-bottom.png" }) {
      childImageSharp {
        gatsbyImageData(
          width: 2560
          placeholder: NONE
          layout: FIXED
        )
      }
    }
    mountBottomLg: file(relativePath: { eq: "mount-bottom.png" }) {
      childImageSharp {
        gatsbyImageData(
          width: 3400
          placeholder: NONE
          layout: FIXED
        )
      }
    }
  }
`
