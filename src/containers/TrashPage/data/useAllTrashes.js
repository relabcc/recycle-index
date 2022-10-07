import { graphql, useStaticQuery, withPrefix } from "gatsby";
import { get } from "lodash";
import { useMemo } from "react";
import useSWR from "swr";

import getFormatedTrashes from "./getFormatedTrashes";
import useGatsbyImage from "./useGatsbyImage";

const useAllTrashes = (controlled) => {
  const {
    site: {
      siteMetadata: { version },
    },
  } = useStaticQuery(graphql`
    query AllTrashesQuery {
      site {
        siteMetadata {
          version
        }
      }
    }
  `);
  const { data: dd } = useSWR(
    typeof controlled === "undefined" || controlled
      ? withPrefix(`/data/data.json?v=${version}`)
      : null
  );
  const { data: scale } = useSWR(
    typeof controlled === "undefined" || controlled
      ? withPrefix(`/data/scale.json?v=${version}`)
      : null
  );

  const gatsbyImages = useGatsbyImage();

  return useMemo(() => {
    if (!dd || !scale) return null;
    const formatedTrashes = getFormatedTrashes(dd, scale);
    return formatedTrashes.map((d) => ({
      ...d,
      gatsbyImg: get(gatsbyImages, [d.name, d.name]),
    }));
  }, [dd, scale, gatsbyImages]);
};

export default useAllTrashes;
