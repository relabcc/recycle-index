import React from 'react'

import Fullpage from '../../components/FullpageHeight';
import Box from '../../components/Box';
import useShowHeader from '../../contexts/header/useShowHeader';

const SupportPage = () => {
  useShowHeader('colors.yellow')

  return (
    <Fullpage mt="0" bg="colors.yellow">
    </Fullpage>
  )
}

export default SupportPage
