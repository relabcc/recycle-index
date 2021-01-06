const glob = require('glob')
const fs = require('fs')
const path = require('path')
const { groupBy } = require('lodash')

glob('**/*.png', (err, files) => {
  const folders = groupBy(files, f => path.dirname(f))
  Object.keys(folders).forEach(folder => {
    const files = folders[folder].map(f => {
      const name = path.basename(f)
      const webp = name.replace('.png', '.webp')
      const splitted = name.split('-')
      return splitted.length > 1 ? [splitted[1], name, webp] : [name.split('.')[0], name, webp]
    }).filter(f => f[0])
    const txt = `export default {
      ${files.map(f => {
        const fnanme = f[0].split('.')[0]
        if (folder === '.') return `'${fnanme}': { '${fnanme}': [require('./${f[2]}'), require('./${f[1]}')] },`
        return `'${fnanme}': [require('./${f[2]}'), require('./${f[1]}')],`
      }).join('\n')}
    }`
    fs.writeFileSync(path.resolve(__dirname, folder, folder === '.' ? 'single.js' :'index.js'), txt)
  })
  const txt = `export default {
    ${Object.keys(folders).map(folder => {
      if (folder === '.') return `...require('./single').default,`
      return `'${folder.replace(/\d*\s/g, '')}': require('./${folder}').default,`
    }).join('\n')}
  }`
  fs.writeFileSync(path.resolve(__dirname, 'index.js'), txt)
})
