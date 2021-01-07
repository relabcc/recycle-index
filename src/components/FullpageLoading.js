import React from 'react';
import { Spinner } from '@chakra-ui/react'

import Box from './Box';
import Flex from './Flex';
import Text from './Text';
import Image from './Image';

import { responsive } from './ThemeProvider/theme';

import trash from '../containers/TrashPage/planb.svg'

const FullpageLoading = () => (
  <Box
    position="fixed"
    top="0"
    left="0"
    right="0"
    bottom="0"
    bg="rgba(255, 255, 255, 0.8)"
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
      <Flex alignItems="center" color="black" my="2">
        <Box width={responsive('5em', '2em')} mr="0.5em">
          <Image src={trash} />
        </Box>
        <Text>Loading...</Text>
      </Flex>
    </Box>
  </Box>
);

export default FullpageLoading;
