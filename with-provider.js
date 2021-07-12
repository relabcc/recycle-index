import React from 'react'

import ThemeProvider from './src/components/ThemeProvider'
import MediaProvider from './src/contexts/mediaQuery/MediaProvider'
import HeaderProvider from './src/contexts/header/Provider'
import ContainerWidthProvider from './src/contexts/containerWidth/Provider'
import FontSizeProvider from './src/contexts/fontSize/Provider'

const Providers = ({ element }) =>
  <ThemeProvider>
    <MediaProvider>
      <FontSizeProvider>
        <ContainerWidthProvider>
          <HeaderProvider>
            {element}
          </HeaderProvider>
        </ContainerWidthProvider>
      </FontSizeProvider>
    </MediaProvider>
  </ThemeProvider>

export default Providers
