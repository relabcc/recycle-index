import { round } from 'lodash'
import React, { useMemo } from 'react'
import { useMeasure } from 'react-use'

import Text from '../../components/Text'
import { responsive } from '../../components/ThemeProvider/theme'

const TrashTitle = ({ data, color }) => {
  const [measureRef, { width }] = useMeasure()
  const fontVwSize = useMemo(() => `${round(100 / (data.name.length + (data.name.length > 2 ? 0.5 : 1.375)), 1)}vw`, [data.name])
  const fontSize = useMemo(() => width ? `${Math.min(Math.floor(width / (data.name.length + 1)), width / 4.5)}px` : fontVwSize, [data.name, width, fontVwSize])
  return (
    <div ref={measureRef}>
      <Text
        as="h1"
        color={color}
        fontSize={responsive(fontVwSize, fontSize)}
        fontWeight="900"
        letterSpacing={data.name.length < 3 && '0.5em'}
        ml={data.name.length < 3 && '0.25em'}
      >
        {data.name}
      </Text>
    </div>
  )
}

export default TrashTitle
