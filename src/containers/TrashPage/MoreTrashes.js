import { sampleSize } from 'lodash'
import React, { useMemo } from 'react'

import Box from '../../components/Box'
import PerTrash from '../CataloguePage/PerTrash';
import useAllTrashes from './data/useAllTrashes'

const MoreTrashes = ({ id }) => {
  const allData = useAllTrashes()
  const readeMore = useMemo(() => allData && sampleSize(allData.filter(d => d.gatsbyImg && d.id !== id), 5), [id, allData])

  return readeMore ? readeMore.map(d => (
    <Box key={d.id} width="20%">
      <Box p="2%">
        <PerTrash data={d} />
      </Box>
    </Box>
  )) : <Box width="20%"><Box pt="100%" /></Box>
}

export default MoreTrashes
