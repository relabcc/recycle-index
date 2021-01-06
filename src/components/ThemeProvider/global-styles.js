import { css } from '@emotion/react'

import theme from './theme'

export default css`
  @import url('https://fonts.googleapis.com/css2?family=Concert+One&family=Nunito+Sans:wght@600;700;900&family=Noto+Sans+TC:wght@500;700;900&display=swap');
  body {
    min-width: 100%;
    min-height: 100%;
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
