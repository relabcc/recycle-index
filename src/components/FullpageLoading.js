import React from 'react';
import { Spinner } from '@chakra-ui/react'
import { StaticImage } from 'gatsby-plugin-image';

import Box from './Box';
import Flex from './Flex';
import Text from './Text';

const FullpageLoading = () => (
  <Box
    position="fixed"
    top="0"
    left="0"
    right="0"
    bottom="0"
    bg="rgba(255, 255, 255, 0.95)"
    zIndex="overlay"
    textAlign="center"
  >
    <Box
      position="absolute"
      left="50%"
      top="50%"
      transform="translate(-50%, -50%)"
    >
      <Spinner
        color="colors.yellow"
        size="xl"
      />
      <Flex alignItems="center" color="black" my="2" fontSize="16px">
        <Box width="2em" mr="0.5em">
          <StaticImage layout="fullWidth" src="../containers/TrashPage/planb.svg" alt="小垃圾" placeholder="tracedSVG" />
        </Box>
        <Text>Loading...</Text>
      </Flex>
    </Box>
  </Box>
);

export default FullpageLoading;
