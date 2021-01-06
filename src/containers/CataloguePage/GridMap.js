import React, { useMemo, useState } from 'react'
import { MapContainer, ImageOverlay, SVGOverlay, useMapEvents } from 'react-leaflet'
import { CRS } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { chunk, range } from 'lodash';
import { useFormik } from 'formik'
import { useHistory } from 'react-router-dom';

import imgSize from '../TrashPage/data/imgSize';
import useData from '../TrashPage/data/useData'

import Box from '../../components/Box';
import theme from '../../components/ThemeProvider/theme';
import FilterAndSearch from './FilterAndSearch';

const defaultZoom = 3
const perRow = 10
const gridSize = [...imgSize.map(s => s * 0.04)].reverse()
const gridSpan = gridSize.map(d => d * 10)

const Items = ({ data }) => {
  const history = useHistory()
  const [zoom, setZoom] = useState(defaultZoom)
  const map = useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom())
    }
  })
  return useMemo(() => data ? chunk(data, perRow).reduce((all, row, i) => [
    ...all,
    ...row.map((d, j) => {
      const y = i && (i % 2 ? 1 : -1) * Math.ceil(i / 2)
      const opacity = d.isDisabled ? 0.2 : 1
      return range(3).reduce((dups, k) => {
        const center = [
          (y - 0.5) * gridSize[0],
          gridSpan[1] * (k - 1.5) + j * gridSize[1] + (y % 2 - 1) * gridSize[1] / 2]
        const bounds = [center, [center[0] + gridSize[0], center[1] + gridSize[1]]]
        return [
          ...dups,
          <ImageOverlay
            key={`${i}${j}${k}`}
            url={d.img}
            interactive
            bounds={bounds}
            opacity={opacity}
            eventHandlers={{
              click: () => {
                if (!d.isDisabled) history.push(`/trash/${d.id}`)
              },
            }}
          />,
          <SVGOverlay bounds={bounds}>
            <text
              x="50%"
              y="98%"
              textAnchor="middle"
              fontWeight="500"
              fontSize={`${1.5 * (2 ** (zoom - defaultZoom))}em`}
              fontFamily={theme.fonts.body}
              opacity={opacity}
              letterSpacing="0.075em"
            >
              {d.name}
            </text>
          </SVGOverlay>
        ]
      }, [])
    })
  ], []) : null, [data, zoom])
}

const Catalogue = ({ scrollWheelZoom }) => {
  const { values, handleChange, setFieldValue } = useFormik({
    initialValues: {
      search: '',
    },
  })
  const data = useData()
  const filteredData = useMemo(() => {
    return data && data.filter(d => d.img).map(d => {
      const isDisabled = Object.keys(values).reduce((res, key) => {
        if (!values[key]) return res
        if (key === 'search') return res || !new RegExp(values[key]).test(d.name)
        return res || (!d[key] || !d[key].includes(String(values[key])))
      }, false)
      return {
        ...d,
        isDisabled,
      }
    })
  }, [data, values])
  return (
    <Box.Relative height="100%" bg="white" zIndex="10">
      <Box.Absolute top="0" left="0" right="0" bg="white" px="2em" zIndex="dropdown">
        <FilterAndSearch onChange={handleChange} setFieldValue={setFieldValue} values={values} />
      </Box.Absolute>
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={[0, 0]}
        zoom={defaultZoom}
        maxZoom={4}
        minZoom={2}
        scrollWheelZoom={scrollWheelZoom}
        zoomControl={false}
        attributionControl={false}
        crs={CRS.Simple}
        maxBounds={[
          [5 * gridSize[0], -12 * gridSize[1]],
          [-5 * gridSize[0], 10 * gridSize[1]],
        ]}
      >
        <Items data={filteredData} />
      </MapContainer>
    </Box.Relative>
  )
}

export default Catalogue
