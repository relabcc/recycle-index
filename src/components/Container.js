import styled from '@emotion/styled';

import Box from './Box';
import { containerWidth, responsive } from './ThemeProvider/theme';

const Container = styled(Box)``

Container.defaultProps = {
  mx: 'auto',
  px: responsive('1em', '2em'),
  maxWidth: containerWidth,
};

Container.displayName = 'Container';

export default Container;
