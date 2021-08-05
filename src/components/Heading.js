import React, { forwardRef, useEffect, useState } from 'react'
import { Heading } from '@chakra-ui/react'
import range from 'lodash/range'
import FontFaceObserver from 'fontfaceobserver'

const ReHeading = forwardRef(({ ensureFont, opacity, fontWeight, ...props }, ref) => {
  const [loaded, setLoaded] = useState(!ensureFont)
  useEffect(() => {
    const font = new FontFaceObserver(ensureFont, {
      weight: fontWeight
    });

    font.load().then(() => setLoaded(true), () => setLoaded(true));
  }, [ensureFont, fontWeight])
  return <Heading opacity={+loaded} fontWeight={fontWeight} {...props} ref={ref} />
})

ReHeading.defaultProps = {
  fontWeight: 700,
}

range(1, 7).forEach((key) => {
  ReHeading[`H${key}`] = forwardRef((props, ref) => (
    <ReHeading
      as={`h${key}`}
      fontSize={`${5 - key}xl`}
      {...props}
      ref={ref}
    />
  ));
});

export default ReHeading
