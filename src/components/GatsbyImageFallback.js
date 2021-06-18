import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { AspectRatio } from '@chakra-ui/layout'

import BackgroundImage from './BackgroundImage'

const GatsbyImageFallback = ({ src, alt, ratio }) => {
  const image = src && src.localFile && getImage(src.localFile)
  return image && !process.env.GATSBY_USE_API ? (
    <AspectRatio ratio={ratio}>
      <GatsbyImage
        layout="fullWidth"
        alt={alt}
        image={image}
        loading="lazy"
      />
    </AspectRatio>
  ) : (
    <BackgroundImage
      src={src?.url}
      ratio={ratio}
    />
  )
}

export default GatsbyImageFallback
