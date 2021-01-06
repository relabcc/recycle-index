import camelCase from 'lodash/camelCase'

import { responsiveIndex } from '../../components/ThemeProvider/theme';

const helper = q => responsiveIndex.reduce((r, [i, name]) => {
  r[camelCase(`is-${name}`)] = !q[i]
  return r
}, {})

export default helper
