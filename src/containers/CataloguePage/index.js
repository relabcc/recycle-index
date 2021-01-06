import React from 'react'

import Fullpage from '../../components/FullpageHeight';
import Box from '../../components/Box';
import useShowHeader from '../../contexts/header/useShowHeader';

import Grid from './Grid';
import Footer from '../Footer';

const Catalogue = () => {
  useShowHeader('colors.yellow')

  return (
    <Fullpage mt="0">
      <Box.Relative height="100%">
        <Grid />
        {/* <Footer /> */}
      </Box.Relative>
    </Fullpage>
  )
}

export default Catalogue
