import React, { useMemo, useState } from 'react'
import { useFormik } from 'formik'
import { isArray } from 'lodash';
import Measure from 'react-measure';
import { FixedSizeGrid as Grid } from 'react-window';
// import {useTransition, animated} from 'react-spring'

// import imgSize from '../TrashPage/data/imgSize';
import useData from '../TrashPage/data/useData'

import Box from '../../components/Box';
import theme, { responsive } from '../../components/ThemeProvider/theme';
import FilterAndSearch from './FilterAndSearch';

import useResponsive from '../../contexts/mediaQuery/useResponsive'
import PerTrash from './PerTrash';
import Footer from '../Footer';

function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}
const scrollBarWidth = getScrollbarWidth()

const Cell = ({ columnIndex, rowIndex, data, style }) => {
  const d = data[rowIndex][columnIndex]
  // console.log(d)
  return d ? (
    <div style={style}>
      <PerTrash data={d} />
    </div>
  ) : null
};

const Catalogue = () => {
  const { values, handleChange, setFieldValue } = useFormik({
    initialValues: {
      search: '',
    },
  })
  const [size, setSize] = useState({})
  const data = useData()
  // const gridRef = useRef()
  const okData = useMemo(() => {
    return data ? (data.filter(d => {
      // if (!images[d.name]) console.log(d.name)
      return d.img
    })) : []
  }, [data])
  const { getCurrentValue } = useResponsive()
  const perRow = getCurrentValue(responsive(3, 4, 6))

  const filtered = useMemo(() => okData.filter(d => {
    const isDisabled = Object.keys(values).reduce((res, key) => {
      if (!values[key]) return res
      if (key === 'search') {
        const re = new RegExp(values[key], 'gi')
        return res || !(re.test(d.name) || d.synonym.some(s => re.test(s)))
      }
      return res || (!d[key] || !(isArray(d[key]) ? d[key].includes(String(values[key])) : d[key] === values[key]))
    }, false)
    return !isDisabled
  }), [values, okData])

  const itemArray = useMemo(() => filtered.reduce((arr, item, j) => {
    const row = Math.floor(j / perRow)
    arr[row] = arr[row] || []
    arr[row].push(item)
    return arr
  }, []), [filtered, perRow])
  return (
    <Box height="100%" bg="gray.100">
      <Box position="fixed" top={theme.headerHeight} left="0" right="0" bg="white" px="2em" zIndex="dropdown">
        <FilterAndSearch
          onChange={handleChange}
          setFieldValue={setFieldValue}
          values={values}
        />
      </Box>
      <Box pt={responsive('10em', '4.5em', '3.25em')} height="100%" px="1.5em">
        <Measure bounds onResize={({ bounds }) => setSize(bounds)}>
          {({ measureRef }) => (
            <Box height="100%" ref={measureRef}>
              {(size.width && filtered.length) ? (
                <Grid
                  // innerRef={gridRef}
                  columnCount={perRow}
                  columnWidth={(size.width - scrollBarWidth) / perRow}
                  height={size.height}
                  rowCount={Math.ceil(filtered.length / perRow)}
                  rowHeight={(size.width - scrollBarWidth) / perRow}
                  width={size.width}
                  itemData={itemArray}
                  style={{ overflowX: 'hidden' }}
                >
                  {Cell}
                </Grid>
              ) : null}
            </Box>
          )}
        </Measure>
      </Box>
      <Footer noSponsor />
    </Box>
  )
}

export default Catalogue
