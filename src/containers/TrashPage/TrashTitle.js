import React from 'react'
import { useMeasure } from 'react-use'

import Text from '../../components/Text'

const TrashTitle = ({ data, color }) => {
  const [measureRef, { width }] = useMeasure()
  return (
    <div ref={measureRef}>
      <Text
        as="h1"
        color={color}
        fontSize={width ? `${Math.min(Math.floor(width / (data.name.length + 1)), width / 4.5)}px` : '15vw'}
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
