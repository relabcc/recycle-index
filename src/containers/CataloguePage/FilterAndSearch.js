import React, { useMemo, useRef, useState } from 'react'
import Select from 'react-select'
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
import theme, { Media, responsive } from '../../components/ThemeProvider/theme';

import useIsEn from '../useIsEn'
import trashEn from '../trashEn'

const recommendedKeywords = [
  '充電線/電源線',
  '碎玻璃',
  '木材/木頭家具',
  '衣架',
  '打火機',
  '鞋',
  '耳機',
  '行李箱',
  '陶瓷碗盤',
  '絨毛娃娃玩偶',
]

const filterOptions = (isEn) => ([
  {
    name: 'places',
    label: isEn ? 'Often seen in...' : '常見地點',
    options: [
      { label: isEn ? 'Restaurants / Night Markets' : '餐廳／夜市', value: 1 },
      { label: isEn ? 'School' : '學校', value: 2 },
      { label: isEn ? 'Home - Kitchen' : '家庭－廚房', value: 3 },
      { label: isEn ? 'Home - Bathroom' : '家庭－衛浴', value: 4 },
      { label: isEn ? 'Home - Living Room' : '家庭－居家', value: 5 },
      { label: isEn ? 'Office' : '辦公室', value: 6 },
      { label: isEn ? 'Delivery' : '美食/生鮮外送 ( foodpanda 贊助 )', value: 7 },
      { label: isEn ? 'Convenience Store' : '便利商店（全家便利商店贊助）', value: 8 },
    ],
  },
  {
    name: 'recycleStatus',
    label: isEn ? 'Is it Recyclable?' : '可／不可回收',
    options: [
      { label: isEn ? 'Non-Recyclable' : '不可回收', value: '不可回收' },
      { label: isEn ? 'Partial Recyclable' : '部分可回收', value: '部分可回收' },
      { label: isEn ? 'Recyclable' : '可回收', value: '可回收' },
      { label: isEn ? 'Others' : '其他', value: '其他' },
    ],
  },
  {
    name: 'recycleValue',
    label: isEn ? 'Recycle Value of the Trash' : '垃圾的回收價值',
    options: [
      { label: isEn ? 'Low Value' : '低回收價值', value: 'C', color: theme.colors.colors.pink },
      { label: isEn ? 'Medium Value' : '中回收價值', value: 'B', color: theme.colors.colors.orange },
      { label: isEn ? 'High Value' : '高回收價值', value: 'A', color: theme.colors.colors.green },
    ],
  },
].map((group) => ({
  ...group,
  options: group.options.map(opt => ({
    ...opt,
    color: opt.color || theme.colors.colors.yellow
  }))
})))

const valueToOption = (isEn) => filterOptions(isEn).reduce((vto, field) => {
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
    <Box as="label" fontSize="0.875em">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="0.5em"
        borderColor="gray.500"
        m="0.5em"
        _checked={{
          bg: props.color || "colors.yellow",
          borderColor: props.color || "colors.yellow",
          color: props.color && props.color !== '#ffd000' && 'white'
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px="0.75em"
        py="0.25em"
      >
        {props.children}
      </Box>
    </Box>
  )
}

const FilterInput = ({
  isMobile,
  isEn,
  value,
  onChangeDraft,
  onKeyDown,
  suggestions,
  onSuggestionSelect,
  onFocus,
  onBlur,
  isFocused,
  highlightedIndex,
  suggestionRefs,
}) => (
  <Box position="relative" width={responsive('auto', '15em')} flex={responsive('1', 'auto')}>
    <InputGroup ml={responsive(0, '1em')} fontSize={responsive('1em', '0.75em')}>
      <Input
        lineHeight="2.25rem"
        fontSize="1em"
        placeholder={isEn ? `Insert Keyword${isMobile ? '' : ', e.g. Helmet'}` : `輸入垃圾關鍵字${isMobile ? '' : '，例如：水果網套'}`}
        value={value}
        name="search"
        onChange={onChangeDraft}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete="off"
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
    {isFocused && suggestions.length > 0 && (
      <Box
        position="absolute"
        top="calc(100% + 0.25em)"
        left="0"
        right="0"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="md"
        borderRadius="0.25em"
        maxHeight="16em"
        overflowY="auto"
        zIndex="popover"
      >
        {suggestions.map(({ label, value: keyword }, idx) => (
          <Box
            key={`${keyword}-${label}`}
            px="0.75em"
            py="0.5em"
            fontSize="0.95em"
            cursor="pointer"
            bg={idx === highlightedIndex ? 'gray.100' : 'transparent'}
            _hover={{ backgroundColor: 'gray.100' }}
            ref={(el) => { if (suggestionRefs) suggestionRefs.current[idx] = el }}
            onMouseDown={(e) => {
              e.preventDefault();
              onSuggestionSelect(keyword);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              onSuggestionSelect(keyword);
            }}
          >
            {label}
          </Box>
        ))}
      </Box>
    )}
  </Box>
)

const FilterAndSearch = ({ onChange, values, setFieldValue, searchCandidates = [] }) => {
  const isEn = useIsEn()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchDraft, setSearchDraft] = useState(values.search || '')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const suggestionRefs = useRef([])

  React.useEffect(() => {
    setSearchDraft(values.search || '')
  }, [values.search])

  const suggestions = useMemo(() => {
    const baseList = recommendedKeywords.map((kw) => {
      const zh = kw
      const mappedEn = trashEn[zh]
      const label = isEn ? (mappedEn || zh) : zh
      return { label, value: label, source: 'recommended' }
    })

    const dynamicList = (searchCandidates || []).map((name) => ({
      label: name,
      value: name,
      source: 'data',
    }))

    const merged = [...baseList, ...dynamicList]
    const deduped = []
    const seen = new Set()
    merged.forEach((item) => {
      const key = item.value.toLowerCase()
      if (seen.has(key)) return
      seen.add(key)
      deduped.push(item)
    })

    const query = (searchDraft || '').trim().toLowerCase()
    if (!query) return baseList

    return deduped
      .filter(({ label, value }) =>
        label.toLowerCase().includes(query) || value.toLowerCase().includes(query)
      )
      .slice(0, 20)
  }, [isEn, searchDraft, searchCandidates])

  React.useEffect(() => {
    setHighlightedIndex(-1)
    suggestionRefs.current = []
  }, [searchDraft, suggestions.length])

  React.useEffect(() => {
    if (highlightedIndex < 0) return
    const node = suggestionRefs.current[highlightedIndex]
    if (node && typeof node.scrollIntoView === 'function') {
      node.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  const handleSuggestionSelect = (keyword) => {
    setSearchDraft(keyword)
    setFieldValue('search', keyword)
    setIsSearchFocused(false)
    setHighlightedIndex(-1)
  }

  const handleSearchFocus = () => setIsSearchFocused(true)
  const handleSearchBlur = () => {
    setTimeout(() => setIsSearchFocused(false), 150)
    setFieldValue('search', searchDraft)
  }

  const handleSearchChange = (e) => {
    setSearchDraft(e.target.value)
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const picked = highlightedIndex >= 0 && suggestions[highlightedIndex]
      const nextValue = picked ? picked.value : searchDraft
      handleSuggestionSelect(nextValue)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!suggestions.length) return
      setHighlightedIndex((prev) => {
        const next = prev + 1 >= suggestions.length ? 0 : prev + 1
        return next
      })
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!suggestions.length) return
      setHighlightedIndex((prev) => {
        if (prev <= 0) return suggestions.length - 1
        return prev - 1
      })
      return
    }

    if (e.key === 'Escape') {
      setIsSearchFocused(false)
      setHighlightedIndex(-1)
    }
  }

  return (
    <>
      <Media at="mobile">
        <Flex py="0.5em">
          <Button
            leftIcon={<GrFilter />}
            fontSize="0.875em"
            height="auto"
            onClick={onOpen}
            mr="1em"
          >篩選器</Button>
          <FilterInput
            isEn={isEn}
            value={searchDraft}
            onChangeDraft={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            isMobile
            suggestions={suggestions}
            onSuggestionSelect={handleSuggestionSelect}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            isFocused={isSearchFocused}
            highlightedIndex={highlightedIndex}
            suggestionRefs={suggestionRefs}
          />
        </Flex>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          header="篩選器"
          body={(
            <Box>
              {filterOptions(isEn).map(({ name, label, options }) => (
                <Box key={name} my="1em">
                  <Text mb="0.5em" fontSize="1.125em" fontWeight="500">{label}</Text>
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
            <Box fontSize="1em" pb="1em">
              <Button
                height="2em"
                fontSize="1em"
                mr="1em"
                onClick={() => {
                  filterOptions(isEn).forEach(({ name }) => setFieldValue(name, ''))
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
      </Media>
      <Media greaterThan="mobile">
        <Flex py="0.5em">
          {filterOptions(isEn).map(({ name, label, options }) => (
            <Box key={name} width={responsive('20%', '15rem')} px={responsive('0.25em', '1em')} fontSize={responsive('2.5em', '0.75em')}>
              <Select
                options={options}
                placeholder={label}
                value={valueToOption(isEn)[name][values[name]]}
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
          <FilterInput
            isEn={isEn}
            value={searchDraft}
            onChangeDraft={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            suggestions={suggestions}
            onSuggestionSelect={handleSuggestionSelect}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            isFocused={isSearchFocused}
            highlightedIndex={highlightedIndex}
            suggestionRefs={suggestionRefs}
          />
        </Flex>
      </Media>
    </>
  )
}

export default FilterAndSearch
