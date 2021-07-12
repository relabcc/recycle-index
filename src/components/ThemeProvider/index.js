import React from 'react';
import { Global } from '@emotion/react'
import { ChakraProvider } from "@chakra-ui/react"

import globalStyles from './global-styles';

import theme, { MediaContextProvider } from './theme';

const ThemeProvider = ({ children }) => (
  <ChakraProvider theme={theme} resetCSS>
    <MediaContextProvider>
      <>
        <Global styles={globalStyles} />
        {children}
      </>
    </MediaContextProvider>
  </ChakraProvider>
);

export default ThemeProvider
