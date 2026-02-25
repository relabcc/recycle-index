import React, { useContext, useMemo } from 'react'
import { useFormik } from 'formik'
import { isArray, range, shuffle } from 'lodash';
import { SizeMe } from 'react-sizeme';
import { FixedSizeGrid as Grid } from 'react-window';

// import imgSize from '../TrashPage/data/imgSize';
import useData from '../TrashPage/data/useData'

import Box from '../../components/Box';
import Link from '../../components/Link';
import BackgroundImage from '../../components/BackgroundImage';
import Flex from '../../components/Flex';
import theme, { responsive } from '../../components/ThemeProvider/theme';
import FilterAndSearch from './FilterAndSearch';
import { TopbarHeightContext } from '../Layout';

import useResponsive from '../../contexts/mediaQuery/useResponsive'

const Cell = ({ columnIndex, rowIndex, data, style }) => {
  const d = data[rowIndex][columnIndex]
  return d ? (
    <div style={style}>
      <Link to={`/trash/${d.id}`}>
        <BackgroundImage backgroundSize="contain" ratio={1} src={d.img} />
      </Link>
    </div>
  ) : null
};

const Catalogue = ({ shouldFix }) => {
  const topbarHeight = useContext(TopbarHeightContext)
  const { values, handleChange, setFieldValue } = useFormik({
    initialValues: {
      search: '',
    },
  })
  const data = useData()
  const { getCurrentValue } = useResponsive()
  const preRow = getCurrentValue(responsive(4, 6, 8))

  const filteredData = useMemo(() => {
    return data ? shuffle(data).filter(d => {
      // if (!images[d.name]) console.log(d.name)
      const isDisabled = Object.keys(values).reduce((res, key) => {
        if (!values[key]) return res
        if (key === 'search') return res || !new RegExp(values[key]).test(d.name)
        return res || (!d[key] || !(isArray(d[key]) ? d[key].includes(String(values[key])) : d[key] === values[key]))
      }, false)
      return d.img && !isDisabled
    }) : []
  }, [data, values])

  const itemArray = useMemo(() => filteredData.reduce((arr, item, j) => {
    const row = Math.floor(j / preRow)
    arr[row] = arr[row] || []
    arr[row].push(item)
    return arr
  }, []), [filteredData, preRow])

  return (
    <Box height="100%" bg="white">
      <Box position={shouldFix ? 'fixed' : 'absolute'} top={`calc(${theme.headerHeight} + ${topbarHeight}px)`} left="0" right="0" bg="white" px="2em" zIndex="dropdown">
        <FilterAndSearch onChange={handleChange} setFieldValue={setFieldValue} values={values} />
      </Box>
      <Box pt="5em" px="1em" height="100%">
        <SizeMe monitorHeight>
          {({ size }) => (
            <Box height="100%">
              {size.width && filteredData.length && (
                <Grid
                  columnCount={preRow}
                  columnWidth={size.width / preRow}
                  height={size.height}
                  rowCount={Math.ceil(filteredData.length / preRow)}
                  rowHeight={size.width / preRow}
                  width={size.width}
                  itemData={itemArray}
                >
                  {Cell}
                </Grid>
              )}
            </Box>
          )}
        </SizeMe>
      </Box>
    </Box>
  )
}

export default Catalogue
