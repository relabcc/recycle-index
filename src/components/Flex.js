import React, { forwardRef } from 'react'
import { Flex } from "@chakra-ui/react";
import styled from '@emotion/styled'

const ReFlex = styled(Flex)``

ReFlex.Vertical = forwardRef((props, ref) => <Flex direction="column" {...props} ref={ref} />)

export default ReFlex
