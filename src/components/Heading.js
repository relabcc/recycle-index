import React, { forwardRef } from 'react'
import { Heading } from '@chakra-ui/react'
import range from 'lodash/range'
import styled from '@emotion/styled'

const ReHeading = styled(Heading)``

ReHeading.defaultProps = {
  // fontWeight: 400,
}

range(1, 7).forEach((key) => {
  ReHeading[`H${key}`] = forwardRef((props, ref) => (
    <ReHeading
      as={`h${key}`}
      fontSize={`${5 - key}xl`}
      {...props}
      ref={ref}
    />
  ));
});

export default ReHeading
