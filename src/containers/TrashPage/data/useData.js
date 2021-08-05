import { withPrefix } from 'gatsby'
import { get } from 'lodash'
import { useMemo } from 'react'
import useSWR from 'swr'

import getFormatedTrashes from './getFormatedTrashes'
import useGatsbyImage from './useGatsbyImage'

const useData = () => {
  const { data: cfg } = useSWR(withPrefix('/data/cfg.json'))
  const { data: scale } = useSWR(withPrefix('/data/scale.json'))
  const { data: dd } = useSWR(withPrefix('/data/data.json'))
  // const [data, setData] = useState()
  // window._RECYCLE_JSON = scale
  const gatsbyImages = useGatsbyImage()

  return useMemo(() => {
    if (!cfg || !scale || !dd) return null
    const formatedTrashes = getFormatedTrashes(dd, scale, cfg)
    return formatedTrashes.map(d => ({
      ...d,
      gatsbyImg: get(gatsbyImages, [d.name, d.name]),
     }))
  }, [cfg, dd, gatsbyImages, scale])
  // return data
}

export default useData
