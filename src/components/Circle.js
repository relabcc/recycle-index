import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { AspectRatio } from '@chakra-ui/react';

import Box from './Box';

const Circle = forwardRef(({ children, border, borderWidth, borderColor, bg, as, textAlign, ...props }, ref) => (
  <Box {...props} ref={ref}>
    <AspectRatio ratio={1}>
      <Box
        borderRadius="50%"
        border={border}
        borderColor={borderColor}
        borderWidth={borderWidth}
        bg={bg}
        as={as}
      >
        <Box
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          position="absolute"
          width="100%"
          textAlign="center"
        >
          {children}
        </Box>
      </Box>
    </AspectRatio>
  </Box>
));

Circle.propTypes = {
  children: PropTypes.node,
  border: PropTypes.string,
  borderColor: PropTypes.string,
  bg: PropTypes.string,
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
};

Circle.displayName = 'Circle';

export default Circle;
