import { groupBy, reduce } from "lodash"
import { useMemo } from "react"
import { useStaticQuery, graphql } from "gatsby"

// const trashBreakpoins = [256, 320, 512]

const useGatsbyImage = () => {
  const { allFile } = useStaticQuery(graphql`
    query FilesQuery {
      allFile {
        edges {
          node {
            name
            childImageSharp {
              regular: gatsbyImageData(
                placeholder: TRACED_SVG
                layout: FULL_WIDTH
                breakpoints: [256, 512]
              )
            }
            relativeDirectory
            publicURL
          }
        }
      }
    }
  `)
  return useMemo(() => {
    const grouped = groupBy(allFile.edges, 'node.relativeDirectory')
    return reduce(grouped, (f, files, group) => {
      if (group) {
        const name = group.replace(/(\d|\s)+/, '')
        f[name] = {}
        files.forEach(({ node }) => {
          const [pn, partName] = node.name.split('-')
          f[name][partName || pn] = node.childImageSharp
        })
      } else {
        files.forEach(({ node }) => {
          f[node.name] = { [node.name]: node.childImageSharp }
        })
      }
      return f
    }, {})
  }, [allFile])
}

export default useGatsbyImage
