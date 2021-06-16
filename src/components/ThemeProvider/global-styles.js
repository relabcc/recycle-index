import { css } from '@emotion/react'

import theme from './theme'

export default css`
  body {
    min-width: 100%;
    min-height: 100%;
  }

  body style {
    display: none!important;
  }

  img {
    width: 100%;
  }

  ::-moz-selection {
    background: ${theme.colors.colors.yellow};
  }

  ::selection {
    background: ${theme.colors.colors.yellow};
  }
`;
