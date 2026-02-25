import React, { useContext, useMemo } from 'react'
import { useFormik } from 'formik'
import { cloneDeep, isArray, range, shuffle } from 'lodash';
import { SizeMe } from 'react-sizeme';
import { AspectRatio } from '@chakra-ui/react';

// import imgSize from '../TrashPage/data/imgSize';
import useData from '../TrashPage/data/useData'

import Box from '../../components/Box';
import Link from '../../components/Link';
import Text from '../../components/Text';
import Flex from '../../components/Flex';
import theme, { responsive } from '../../components/ThemeProvider/theme';
import FilterAndSearch from './FilterAndSearch';
import { TopbarHeightContext } from '../Layout';

import useResponsive from '../../contexts/mediaQuery/useResponsive'

import images from './images'

const getGrid = (items, perRow, perfect) => {
  let grid = []
  let sorted = []
  let queue = shuffle(items)

  const markPos = (x, y) => {
    grid[y] = grid[y] || range(perRow).fill(null)
    grid[y][x] = 1
  }

  const markSpace = ([x, y], size) => {
    for (let i = 0; i < size[0]; i++) {
      for (let j = 0; j < size[1]; j++) {
        markPos(x + i, y + j)
      }
    }
  }

  const getRestX = (pos) => {
    grid[pos[1]] = grid[pos[1]] || range(perRow).fill(null)
    if (grid[pos[1]][pos[0]]) return 0
    const toFind = grid[pos[1]].slice(pos[0])
    const emptySpace = toFind.findIndex(Boolean)
    return emptySpace > -1 ? emptySpace : toFind.length
  }

  const savePosition = (data, pos) => {
    data.pos = pos
    sorted.push(data)
    markSpace(pos, data.size)
  }

  const task = () => {
    let x = 0
    let y = 0
    let tries = 0
    while (queue.length > 0) {
      let restX = getRestX([x, y])
      while (restX < 1) {
        if (x === perRow) {
          x = 0
          y += 1
        } else {
          x += 1
        }
        restX = getRestX([x, y])
      }
      const data = queue.splice(0, 1)[0]
      if (data.size[0] <= restX) {
        tries = 0
        savePosition(data, [x, y])
        x += data.size[0]
      } else {
        if (tries > 20) {
          x = 0
          y += 1
        } else {
          tries += 1
          queue.push(data)
        }
      }
    }
  }
  task()
  if (perfect) {
    while (!grid.every(row => row.every(Boolean))) {
      grid = []
      sorted = []
      queue = shuffle(items)
      task()
    }
  }

  return sorted
}

const Catalogue = ({ shouldFix }) => {
  const topbarHeight = useContext(TopbarHeightContext)
  const { values, handleChange, setFieldValue } = useFormik({
    initialValues: {
      search: '',
    },
  })
  const data = useData()
  const okData = useMemo(() => {
    return data ? data.filter(d => {
      // if (!images[d.name]) console.log(d.name)
      return images[d.name]
    }) : []
  }, [data])
  const { getCurrentValue } = useResponsive()
  const perRow = getCurrentValue(responsive(4, 8))
  // console.log(perRow)
  const layout = useMemo(() => {
    // const totalSize = okData.reduce((total, item) => total + item.size[0] * item.size[1], 0)
    // console.log(totalSize, totalSize / 8)
    const sorted = getGrid(okData, perRow, true)
    return sorted
  }, [okData, perRow])
  const filtered = useMemo(() => layout.filter(d => {
    const isDisabled = Object.keys(values).reduce((res, key) => {
      if (!values[key]) return res
      if (key === 'search') {
        const re = new RegExp(values[key], 'g')
        return res || !(re.test(d.name) || d.synonym.some(s => re.test(s)))
      }
      return res || (!d[key] || !(isArray(d[key]) ? d[key].includes(String(values[key])) : d[key] === values[key]))
    }, false)
    return !isDisabled
  }), [values, layout])

  const filteredLayout = useMemo(() => filtered.length === layout.length ? filtered : getGrid(cloneDeep(filtered), perRow), [filtered, layout, perRow])

  return (
    <Box height="100%" bg="white">
      <Box position={shouldFix ? 'fixed' : 'absolute'} top={`calc(${theme.headerHeight} + ${topbarHeight}px)`} left="0" right="0" bg="white" px="2em" zIndex="dropdown">
        <FilterAndSearch onChange={handleChange} setFieldValue={setFieldValue} values={values} />
      </Box>
      <Box pt={theme.headerHeight} px="0.25em">
        <SizeMe>
          {({ size }) => (
            <Box.Relative mt="1em">
              {filteredLayout.map(d => {
                const gridSize = size.width / perRow
                return d.isDisabled ? null : (
                  <Box.Absolute
                    key={d.id}
                    style={{
                      width: gridSize * d.size[0],
                      left: d.pos[0] * gridSize,
                      top: d.pos[1] * gridSize,
                    }}
                  >
                    <Link to={`/trash/${d.id}`}>
                      <AspectRatio ratio={d.size[0] / d.size[1]}>
                        <Box p="0.25em" bg="white">
                          <Flex
                            width="100%"
                            bg="gray.200"
                            height="100%"
                            textAlign="center"
                            flexDirection="column"
                            transition="all 0.25s"
                            _hover={{
                              boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                              transform: 'translate(-4px, -4px)',
                            }}
                          >
                            <Box
                              flex="1"
                              bgImage={`url("${d.img}")`}
                              backgroundSize="contain"
                              backgroundRepeat="no-repeat"
                              backgroundPosition="50% 50%"
                              width="100%"
                            />
                            <Box pb="0.75em">
                              <Text fontWeight="700" letterSpacing="0.125em">{d.name}</Text>
                            </Box>
                          </Flex>
                        </Box>
                      </AspectRatio>
                    </Link>
                  </Box.Absolute>
                )
              })}
            </Box.Relative>
          )}
        </SizeMe>
      </Box>
    </Box>
  )
}

export default Catalogue
