import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { withContentRect } from 'react-measure'

import isIE from './utils/isIE'
import Box from './Box';

const parseViewbox = (vb) => {
  try {
    const [x1, y1, x2, y2] = vb.split(' ');
    return (y2 - y1) / (x2 - x1);
  } catch {
    return 1;
  }
};

const SVG = ({
  viewBox,
  children,
  measure,
  measureRef,
  contentRect: { bounds: { width } },
  ...props
}) => {
  const ratio = useMemo(() =>  parseViewbox(viewBox), [])
  useEffect(() => {
    measure()
  }, [])
  return isIE ? (
    <Box is="span" ref={measureRef} {...props}>
      <Box
        as="svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width={width}
        height={ratio * width}
        verticalAlign="auto"
      >
        {children}
      </Box>
    </Box>
  ) : (
    <Box
      as="svg"
      ref={measureRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      {...props}
    >
      {children}
    </Box>
  );
}

SVG.propTypes = {
  viewBox: PropTypes.string,
  children: PropTypes.node.isRequired,
};

SVG.defaultProps = {
  display: 'inline-block',
}

SVG.displayName = 'SVG';

export default withContentRect('bounds')(SVG);
