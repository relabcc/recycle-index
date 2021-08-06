const { groupBy, reduce } = require("lodash")

module.exports = (allFile) => {
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
}
