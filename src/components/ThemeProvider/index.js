import React from 'react';
import { Global } from '@emotion/react'
import { ChakraProvider } from "@chakra-ui/react"

import globalStyles from './global-styles';

import theme from './theme';

const ReThemeProvider = ({ children }) => (
  <ChakraProvider theme={theme}>
    <>
      <Global styles={globalStyles} />
      {children}
    </>
  </ChakraProvider>
);

export default ReThemeProvider
