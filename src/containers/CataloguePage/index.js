import React from 'react'

import Fullpage from '../../components/FullpageHeight';
import useShowHeader from '../../contexts/header/useShowHeader';

import Grid from './Grid';
import useData from '../TrashPage/data/useData';

const Catalogue = () => {
  useShowHeader('colors.yellow')
  const data = useData()

  return (
    <Fullpage mt="0">
      <Grid data={data} />
    </Fullpage>
  )
}

export default Catalogue
