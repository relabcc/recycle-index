import React, { useMemo } from 'react'
import { useWindowSize } from 'react-use';
import { FixedSizeGrid as Grid } from 'react-window';

import Box from '../../components/Box'

import Page1 from './Page1'
import PageShare from './PageShare'
import PageExplode from './PageExplode'
import useData from './data/useData'
import images from './data/images'

const Cell = ({ data, columnIndex, rowIndex, style }) => {
  const id = rowIndex * 3 + columnIndex
  const d = data[id]
  return (
    <div style={style}>
      {d ? <Page1 match={{ params: { id: d.id } }} /> : null}
    </div>
  )
};

const ShareCell = ({ data, columnIndex, rowIndex, style }) => {
  const id = rowIndex * 2 + columnIndex
  const d = data[id]
  return (
    <div style={style}>
      {d ? <PageShare match={{ params: { id: d.id } }} /> : null}
    </div>
  )
};

const ExplodedCell = ({ data, columnIndex, rowIndex, style }) => {
  const id = rowIndex * 2 + columnIndex
  const d = data[id]
  return d ? (
    <Box style={style} px="1%">
      <PageExplode page={2} match={{ params: { id: d.id } }} windowSize={{ width: style.width * 0.98, height: style.height }} />
    </Box>
  ) : null
};

const BelongsCell = ({ data, columnIndex, rowIndex, style }) => {
  const id = rowIndex * 2 + columnIndex
  const d = data[id]
  return d ? (
    <Box style={style} px="1%">
      <PageExplode page={3} match={{ params: { id: d.id } }} windowSize={{ width: style.width * 0.98, height: style.height }} />
    </Box>
  ) : null
};

const AllPage = ({ exploded, belongsTo, share }) => {
  const windowSize = useWindowSize()
  const data = useData()
  const filteredData = useMemo(() => {
    return data ? data.filter(d => {
      // if (!images[d.name]) console.log(d.name)
      return images[d.name]
    }) : []
  }, [data])
  const perRow = exploded || belongsTo || share ? 2 : 3
  let ele = Cell
  if (exploded) ele = ExplodedCell
  if (belongsTo) ele = BelongsCell
  if (share) ele = ShareCell
  return filteredData.length ? (
    <Grid
      columnCount={perRow}
      columnWidth={windowSize.width / perRow}
      height={windowSize.height}
      rowCount={Math.ceil(filteredData.length / perRow)}
      rowHeight={windowSize.height / perRow}
      width={windowSize.width}
      itemData={filteredData}
    >
      {ele}
    </Grid>
  ) : null
}

export default AllPage
