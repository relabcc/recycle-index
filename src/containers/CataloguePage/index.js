import React, { useMemo } from 'react'

import Fullpage from '../../components/FullpageHeight';
import useShowHeader from '../../contexts/header/useShowHeader';

import Grid from './Grid';
import useAllTrashes from '../TrashPage/data/useAllTrashes';
import FullpageLoading from '../../components/FullpageLoading';

const newer = d => +Boolean(d.isNew)

const Catalogue = () => {
  useShowHeader('colors.yellow')
  const data = useAllTrashes()
  const orderedData = useMemo(() => data?.sort((a,b) => newer(b) - newer(a)), [data])
  return (
    <>
      <Fullpage mt="0">
        <Grid data={orderedData} />
      </Fullpage>
      {!data && <FullpageLoading />}
    </>
  )
}

export default Catalogue
