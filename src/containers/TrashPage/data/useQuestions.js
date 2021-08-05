import { filter, get, groupBy, shuffle } from "lodash"
import { useMemo } from "react"

import useData from "./useData"
import useGatsbyImage from "./useGatsbyImage"

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
      return {
        trash,
        partName,
        recyclable: get(trash.belongsTo, partName || trash.name) !== '一般垃圾',
        layers: layers.map(o => ({
          ...o,
          gatsbyImg: get(gatsbyImages, [trash.name, o.layerName || o.name]),
        })),
      }
    }).filter(d => d && d.trash)
    return formatted
  }, [data, gatsbyImages])

  return useMemo(() => shuffle(questions), [questions, run])
}

export default useQuestions
