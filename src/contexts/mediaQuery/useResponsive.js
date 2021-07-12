import { useContext } from 'react'
import last from 'lodash/last'

import MediaContext from './mediaContext'

import getResponsiveHelper from './getResponsiveHelper'

const useResponsive = () => {
  const q = useContext(MediaContext)
  return {
    ...getResponsiveHelper(q),
    getCurrentValue: (resArr) => {
      const ff = q.findIndex(v => !v)
      return ff === -1 ? last(resArr) : resArr[ff]
    },
  }
}

export default useResponsive
