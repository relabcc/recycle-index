import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

import Box from './Box'

const ptr = keyframes`
0%,
40%,
80% {
  transform: translate3d(0,0,0);
}

20%,
60% {
  transform: translate3d(0,20%,0);
}
`

const PointingDown = styled(Box)`
animation: ${ptr} 2s infinite;
`

export default PointingDown
