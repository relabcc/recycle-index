import { filter, get, groupBy, shuffle } from "lodash"
import { useMemo } from "react"

import useData from "./useData"
import useGatsbyImage from "./useGatsbyImage"
import normalizeName from "../../../utils/normalizeName"

const useQuestions = (run = 0) => {
  const data = useData()
  const gatsbyImages = useGatsbyImage()

  const questions = useMemo(() => {
    if (!data) return []
    const trashes = data.reduce((all, d) => {
      all[d.name] = d
      return all
    }, {})
    const questions = data.reduce(((all, d) => {
      if (!d.parts) return all
      const grouped = groupBy(d.parts, 'order')
      return [...all, ...filter(grouped, g => g.some(d => d.inGame))]
    }), [])

    const formatted = questions.map(layers => {
      const partName = get(layers.find(l => l.partName), 'partName')
      const trash = trashes[layers[0].name]
      if (!trash) return null

      const trashName = normalizeName(trash.name)

      const mappedLayers = layers.map(o => ({
        ...o,
        gatsbyImg: get(gatsbyImages, [trashName, normalizeName(o.layerName || o.name)]),
      }))

      return {
        trash,
        partName,
        recyclable: get(trash.belongsTo, partName || trash.name) !== '一般垃圾',
        layers: mappedLayers,
      }
    }).filter(d => d && d.trash)
    return formatted
  }, [data, gatsbyImages])

  return useMemo(() => shuffle(questions), [questions, run])
}

export default useQuestions
