import React from 'react'

import Fullpage from '../../components/FullpageHeight';
import useShowHeader from '../../contexts/header/useShowHeader';

import Grid from './Grid';
import useAllTrashes from '../TrashPage/data/useAllTrashes';
import FullpageLoading from '../../components/FullpageLoading';

const Catalogue = () => {
  useShowHeader('colors.yellow')
  const data = useAllTrashes()
  return (
    <>
      <Fullpage mt="0">
        <Grid data={data} />
      </Fullpage>
      {!data && <FullpageLoading />}
    </>
  )
}

export default Catalogue
