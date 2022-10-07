import { graphql, useStaticQuery } from "gatsby";
import { get } from "lodash";
import { useMemo } from "react";
import useSWR from "swr";

import getFormatedTrashes from "./getFormatedTrashes";
import useGatsbyImage from "./useGatsbyImage";

const useData = () => {
  const {
    site: {
      siteMetadata: { version },
    },
  } = useStaticQuery(graphql`
    query DataQuery {
      site {
        siteMetadata {
          version
        }
      }
    }
  `);
  const { data: cfg } = useSWR(`/data/cfg.json?v=${version}`);
  const { data: scale } = useSWR(`/data/scale.json?v=${version}`);
  const { data: dd } = useSWR(`/data/data.json?v=${version}`);
  // const [data, setData] = useState()
  // window._RECYCLE_JSON = scale
  const gatsbyImages = useGatsbyImage();

  return useMemo(() => {
    if (!cfg || !scale || !dd) return null;
    const formatedTrashes = getFormatedTrashes(dd, scale, cfg);
    return formatedTrashes.map((d) => ({
      ...d,
      gatsbyImg: get(gatsbyImages, [d.name, d.name]),
    }));
  }, [cfg, dd, gatsbyImages, scale]);
  // return data
};

export default useData;
