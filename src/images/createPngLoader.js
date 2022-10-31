const glob = require('glob')
const fs = require('fs')
const path = require('path')
const { groupBy } = require('lodash')

glob('**/*.png', (err, files) => {
  const folders = groupBy(files, f => path.dirname(f))
  Object.keys(folders).forEach(folder => {
    const files = folders[folder].map(f => {
      const name = path.basename(f)
      const splitted = name.split('-')
      return splitted.length > 1 ? [splitted[1], name] : [name.split('.')[0], name]
    }).filter(f => f[0])
    const txt = `
    const path = require('path')
    module.exports = {
      ${files.map(f => {
        const fnanme = f[0].split('.')[0]
        if (folder === '.') return `'${fnanme}': { '${fnanme}': path.resolve(__dirname, './${f[1]}') },`
        return `'${fnanme}': path.resolve(__dirname, './${f[1]}'),`
      }).join('\n')}
    }`
    fs.writeFileSync(path.resolve(__dirname, folder, folder === '.' ? 'single.png.js' :'index.png.js'), txt)
  })
  const txt = `module.exports = {
    ${Object.keys(folders).map(folder => {
      if (folder === '.') return `...require('./single.png'),`
      return `'${folder.replace(/\d*\s/g, '')}': require('./${folder}/index.png'),`
    }).join('\n')}
  }`
  fs.writeFileSync(path.resolve(__dirname, 'index.png.js'), txt)
})
