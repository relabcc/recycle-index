import { useConst } from "@chakra-ui/react";
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
  const v = useConst(() => process.env.NODE_ENV === "development" ? Date.now() : version);
  const { data: dd } = useSWR(
    typeof controlled === "undefined" || controlled
      ? withPrefix(`/data/data.json?v=${v}`)
      : null
  );
  const { data: scale } = useSWR(
    typeof controlled === "undefined" || controlled
      ? withPrefix(`/data/scale.json?v=${v}`)
      : null
  );
  const { data: cfg } = useSWR(
    typeof controlled === "undefined" || controlled
      ? withPrefix(`/data/cfg.json?v=${v}`)
      : null
  );
  const gatsbyImages = useGatsbyImage();

  return useMemo(() => {
    if (!dd || !scale || !cfg) return undefined;
    const formatedTrashes = getFormatedTrashes(dd, scale, cfg);
    return formatedTrashes.map((d) => ({
      ...d,
      gatsbyImg: get(gatsbyImages, [d.name, d.name]),
    }));
  }, [dd, scale, cfg, gatsbyImages]);
};

export default useAllTrashes;
