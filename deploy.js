const fs = require('fs');
const ghPages = require('gh-pages')

fs.writeFile('./public/CNAME', 'recycle.rethinktw.org', (err) => {
  ghPages.publish('public', {
    repo: 'https://github.com/relabcc/recycle-index.git',
  }, err => {
    if (err) console.error(err)
    console.log('done')
  })
})
