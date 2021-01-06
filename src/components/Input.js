import React from 'react'
import { forwardRef, Input } from "@chakra-ui/react";

const ReInput = forwardRef((props, ref) => (
  <Input height="auto" {...props} ref={ref} />
))

export default ReInput
