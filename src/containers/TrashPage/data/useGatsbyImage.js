import { groupBy, reduce } from "lodash";
import { useMemo } from "react";
import { useStaticQuery, graphql } from "gatsby";
import normalizeName from '../../../utils/normalizeName';

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
  `);
  return useMemo(() => {
    const grouped = groupBy(allFile.edges, "node.relativeDirectory");
    return reduce(
      grouped,
      (f, files, group) => {
        if (group) {
          // normalize directory name to canonical display key
          const name = normalizeName(group);
          f[name] = {};
          files.forEach(({ node }) => {
            const nodeName = decodeURIComponent(node.name);
            const [pn, partName] = nodeName.split("-");
            f[name][partName || pn] = node.childImageSharp;
          });
        } else {
          files.forEach(({ node }) => {
            const nodeName = decodeURIComponent(node.name);
            f[nodeName] = { [nodeName]: node.childImageSharp };
          });
        }
        return f;
      },
      {}
    );
  }, [allFile]);
};

export default useGatsbyImage;
