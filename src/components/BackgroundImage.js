import React, { forwardRef } from 'react';
import { isArray } from 'lodash'
import { AspectRatio } from '@chakra-ui/react';

import Box from './Box'
import useProgressive from './utils/useProgressive';

const BGImage = ({ src, children, progressive, ...props }) => {
  const pic = useProgressive(src, progressive)
  return (
    <Box
      backgroundImage={`url("${isArray(src) ? pic : src}")`}
      {...props}
    >
      {children && (
        <Box.FullAbs>{children}</Box.FullAbs>
      )}
    </Box>
  )
}

BGImage.defaultProps = {
  backgroundSize: 'cover',
  backgroundPosition: '50% 50%',
  backgroundRepeat: 'no-repeat',
};

const BackgroundImage = forwardRef(({ src, children, progressive, ...props }, ref) => (
  <AspectRatio {...props} ref={ref}>
    <BGImage src={src} overflow={props.overflow} progressive={progressive}>{children}</BGImage>
  </AspectRatio>
));

BackgroundImage.displayName = 'BackgroundImage';

export default BackgroundImage
