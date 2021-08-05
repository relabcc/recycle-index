import { withPrefix } from 'gatsby'
import { get } from 'lodash'
import { useMemo } from 'react'
import useSWR from 'swr'
import getFormatedTrashes from './getFormatedTrashes'

import useGatsbyImage from './useGatsbyImage'

const useData = () => {
  const { data: dd } = useSWR(withPrefix('/data/data.json'))
  const { data: scale } = useSWR(withPrefix('/data/scale.json'))

  const gatsbyImages = useGatsbyImage()

  return useMemo(() => {
    if (!dd || !scale) return null
    const formatedTrashes = getFormatedTrashes(dd, scale)
    return formatedTrashes.map(d => ({
      ...d,
      gatsbyImg: get(gatsbyImages, [d.name, d.name]),
     }))
  }, [dd, scale, gatsbyImages])
}

export default useData
