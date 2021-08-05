import React, { useEffect, useMemo, useRef } from 'react'
import { useFormik } from 'formik'
import { isArray, range } from 'lodash';
import loadable from '@loadable/component';

import Box from '../../components/Box';
import Flex from '../../components/Flex';
import theme, { responsive } from '../../components/ThemeProvider/theme';
// import FilterAndSearch from './FilterAndSearch';

import PerTrash from './PerTrash';
import Footer from '../Footer';
import diff from './diff'
import useIsEn from '../useIsEn';
import trashEn from '../trashEn'
// import withLoading from '../withLoading';

const FilterAndSearch = loadable(() => import('./FilterAndSearch'))

let searched
let filterApplied

const Catalogue = ({ data }) => {
  const isEn = useIsEn()
  const { values, handleChange, setFieldValue } = useFormik({
    initialValues: {
      search: '',
    },
  })
  const prevValues = useRef()
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ga) {
      if (!searched) {
        window.ga('send', 'event', '篩選器', '輸入關鍵字');
        searched = true
      }
      if (!filterApplied) {
        window.ga('send', 'event', '篩選器', '使用篩選器');
        filterApplied = true
      }
      if (prevValues.current) {
        const lastest = Object.entries(diff(prevValues.current, values))
        lastest.forEach(([key, value]) => {
          if (value && key !== 'search') {
            window.ga('send', 'event', '篩選器', key, value)
          }
        })
      }
    }
    prevValues.current = values
  }, [values])
  // const gridRef = useRef()
  const okData = useMemo(() => {
    return data ? (data.filter(d => {
      // if (!images[d.name]) console.log(d.name)
      return d.gatsbyImg
    })) : []
  }, [data])

  const filtered = useMemo(() => okData.filter(d => {
    const isDisabled = Object.keys(values).reduce((res, key) => {
      if (!values[key]) return res
      if (key === 'search') {
        const re = new RegExp(values[key], 'gi')
        return res || !(re.test(isEn ? trashEn[d.name] : d.name) || (d.synonym && d.synonym.some(s => re.test(s))))
      }
      return res || (!d[key] || !(isArray(d[key]) ? d[key].includes(String(values[key])) : d[key] === values[key]))
    }, false)
    return !isDisabled
  }), [values, okData, isEn])

  return (
    <Box bg="gray.100">
      <Box position="fixed" top={theme.headerHeight} left="0" right="0" bg="white" px={responsive('1em', '2em')} zIndex="dropdown">
        <FilterAndSearch
          onChange={handleChange}
          setFieldValue={setFieldValue}
          values={values}
        />
      </Box>
      <Flex pt={responsive('4em', '4.5em', '3.25em')} px={responsive('0.5em', '1.5em')} flexWrap="wrap">
        {(data ? filtered : range(101)).map((d, i) => (
          <Box key={i} width={responsive(1 / 3, 1 / 4, 1 / 6)}>
            <PerTrash data={typeof d === 'object' && d} />
          </Box>
        ))}
      </Flex>
      <Footer noSponsor />
    </Box>
  )
}

// const CatalogueWithLoading =  p => {
//   const toLoad = useMemo(() => p.data.slice(1, 12).map(d => d.img), [p.data])
//   return createElement(withLoading(toLoad)(Catalogue), p)
// }

export default Catalogue
