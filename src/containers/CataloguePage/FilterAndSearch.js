import React from 'react'
import Select from 'react-select'
// import chroma from 'chroma-js';
import { MdSearch } from 'react-icons/md'
import { GrFilter } from 'react-icons/gr'
import {
  InputGroup,
  InputRightElement,
  useDisclosure,
  useRadio,
} from '@chakra-ui/react';

import Flex from '../../components/Flex';
import Modal from '../../components/Modal';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Input from '../../components/Input';
import theme, { responsive } from '../../components/ThemeProvider/theme';
import useResponsive from '../../contexts/mediaQuery/useResponsive';

const filterOptions = [
  {
    name: 'places',
    label: '常見地點',
    options: [
      { label: '餐廳／夜市', value: 1 },
      { label: '學校', value: 2 },
      { label: '家庭－廚房', value: 3 },
      { label: '家庭－衛浴', value: 4 },
      { label: '家庭－居家', value: 5 },
      { label: '辦公室', value: 6 },
    ],
  },
  {
    name: 'recycleStatus',
    label: '可／不可回收',
    options: [
      { label: '不可回收', value: '不可回收' },
      { label: '部分可回收', value: '部分可回收' },
      { label: '可回收', value: '可回收' },
      { label: '其他', value: '其他' },
    ],
  },
  {
    name: 'recycleValue',
    label: '垃圾的回收價值',
    options: [
      { label: '低回收價值', value: 'C', color: theme.colors.colors.pink },
      { label: '中回收價值', value: 'B', color: theme.colors.colors.orange },
      { label: '高回收價值', value: 'A', color: theme.colors.colors.green },
    ],
  },
].map((group) => ({
  ...group,
  options: group.options.map(opt => ({
    ...opt,
    color: opt.color || theme.colors.colors.yellow
  }))
}))

const valueToOption = filterOptions.reduce((vto, field) => {
  vto[field.name] = field.options.reduce((vt, opt) => {
    vt[opt.value] = opt
    return vt
  }, {})
  return vto
}, {})

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="0.5em"
        m="0.25em"
        _checked={{
          bg: props.color || "colors.yellow",
          borderColor: props.color || "colors.yellow",
          color: props.color && props.color !== '#ffd000' && 'white'
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

const FilterAndSearch = ({ onChange, values, setFieldValue }) => {
  const { isMobile } = useResponsive()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Flex py={responsive('1.5em', '0.5em')}>
      {isMobile ? (
        <Button
          leftIcon={<GrFilter />}
          fontSize="2.75em"
          height="auto"
          onClick={onOpen}
          mr="2em"
        >篩選器</Button>
      ) : filterOptions.map(({ name, label, options }) => (
        <Box key={name} width={responsive('20%', '15rem')} px={responsive('0.25em', '1em')} fontSize={responsive('2.5em', '0.75em')}>
          <Select
            options={options}
            placeholder={label}
            value={valueToOption[name][values[name]]}
            onChange={selected => setFieldValue(name, selected && selected.value)}
            name={name}
            isClearable
            styles={{
              valueContainer: provided => ({
                ...provided,
                padding: '0.5em 0.5em',
              }),
              placeholder: provided => ({
                ...provided,
                marginLeft: '0.125em',
                marginRight: '0.125em',
              }),
              indicatorSeparator: () => ({
                display: 'none',
              }),
              dropdownIndicator: provided => ({
                ...provided,
                padding: '0.25em',
              }),
              control: provided => ({
                ...provided,
                minHeight: '3em',
                borderRadius: 0,
                border: 'none',
                borderBottom: '2px solid black',
              }),
              option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                return {
                  ...styles,
                  color: 'black',
                  backgroundColor: isDisabled
                    ? null
                    : isSelected
                    ? data.color
                    : isFocused
                    ? data.color
                    : null,
                  cursor: isDisabled ? 'not-allowed' : 'default',
                };
              },
            }}
          />
        </Box>
      ))}
      <InputGroup ml={responsive('0.25em', '1em')} width={responsive('auto', '15em')} flex={responsive('1', 'auto')} fontSize={responsive('16px', '0.75em')}>
        <Input
          lineHeight="2.25"
          fontSize="1em"
          placeholder={`輸入垃圾關鍵字${isMobile ? '' : '，例如：水果網套'}`}
          value={values.search}
          name="search"
          onChange={onChange}
          borderRadius="0"
          border="none"
          borderBottom="2px solid black"
          _hover={{
            borderBottomColor: "black"
          }}
          _focus={{
            borderBottomColor: "black"
          }}
          _active={{
            borderBottomColor: "black"
          }}
        />
        <InputRightElement width="2.5em" height="2.5em" fontSize="1em" px="0" children={<MdSearch size="1.5em" />} />
      </InputGroup>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        header={<Text px="1rem">篩選器</Text>}
        body={(
          <Box px="1em">
            {filterOptions.map(({ name, label, options }) => (
              <Box key={name} my="1em">
                <Text mb="0.5em" fontSize="1.25em">{label}</Text>
                <Flex flexWrap="wrap">
                  {options.map(opt => (
                    <RadioCard
                      name={name}
                      onChange={onChange}
                      key={opt.value}
                      value={opt.value}
                      color={opt.color}
                      isChecked={opt.value == values[name]}
                    >{opt.label}</RadioCard>
                  ))}
                </Flex>
              </Box>
            ))}
          </Box>
        )}
        footer={(
          <Box fontSize="1.25em" pb="1em" px="1em">
            <Button
              height="2em"
              fontSize="1em"
              mr="1em"
              onClick={() => {
                filterOptions.forEach(({ name }) => setFieldValue(name, ''))
              }}
            >清除</Button>
            <Button
              height="2em"
              fontSize="1em"
              onClick={onClose}
            >確定</Button>
          </Box>
        )}
      />
    </Flex>
  )
}

export default FilterAndSearch
