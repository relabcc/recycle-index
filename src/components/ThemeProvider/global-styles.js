import { css } from '@emotion/react'

import theme from './theme'

export default css`
  html,
  body {
    height: 100%;
  }
  body {
    min-width: 100%;
    height: 100%;
  }

  body style {
    display: none!important;
  }

  img {
    width: 100%;
  }

  #___gatsby,
  #gatsby-focus-wrapper {
    height: 100%;
  }

  ::-moz-selection {
    background: ${theme.colors.colors.yellow};
  }

  ::selection {
    background: ${theme.colors.colors.yellow};
  }
`;
