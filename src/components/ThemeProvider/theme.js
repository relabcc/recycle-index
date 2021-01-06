import { theme, extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools"
import { get, mapValues } from "lodash";

import memorize from '../../utils/memorize'

const emToPX = em => `${em * 16}px`

export const breakpoints = createBreakpoints(mapValues({
  sm: 30,
  md: 48,
  lg: 62,
  xl: 80,
}, emToPX))

export const containerWidth = [26, 44, 58, 76, 116].map(emToPX);
export const responsiveIndex = [
  [2, 'mobile'],
  [3, 'tablet'],
  [4, 'laptop'],
]

const responsiveMap = breakpoints.map((_, i) => {
  const id = responsiveIndex.findIndex(([ri]) => ri > i)
  return id >= 0 ? id : responsiveIndex.length
})

export const responsive = memorize((...args) => {
  const argsLen = args.length
  if (argsLen <= 1) return args[0]
  return breakpoints.map((_, i) => get(args, [responsiveMap[i]], null))
});

export const mobileOrDesktop = responsive

const font = '"Nunito Sans", "Noto Sans TC", sans-serif';
const fonts = {
  heading: font,
  body: font,
  number: `"Concert One", ${font}`,
  mono: "Menlo, monospace",
}

const colors = {
  ...theme.colors,
  green: {
    50: '#defef0',
    100: '#b8f4d8',
    200: '#90edc0',
    300: '#66e4a8',
    400: '#3cdc90',
    500: '#22bd73',
    600: '#17975b',
    700: '#0b6c41',
    800: '#014225',
    900: '#001808',
  },
  orange:
  {
    50: '#fff6da',
    100: '#ffe5ad',
    200: '#ffd37d',
    300: '#ffc24b',
    400: '#ffb11a',
    500: '#ffa800',
    600: '#b37600',
    700: '#815400',
    800: '#4e3200',
    900: '#1e1000',
  },
  cyan: {
    50: '#d6ffff',
    100: '#aaffff',
    200: '#7afeff',
    300: '#47fcff',
    400: '#1afcff',
    500: '#00CDD0',
    600: '#00b0b3',
    700: '#007f81',
    800: '#004c4e',
    900: '#001b1d',
  },
  pink: {
    50: '#ffe2ee',
    100: '#ffb1ca',
    200: '#ff7fa7',
    300: '#FF6695',
    400: '#fe1e60',
    500: '#e50646',
    600: '#b30037',
    700: '#810027',
    800: '#4f0016',
    900: '#200008',
  },
  yellow:
  {
    50: '#fffada',
    100: '#fff1ad',
    200: '#ffe87d',
    300: '#ffde4b',
    400: '#ffd51a',
    500: '#ffd000',
    600: '#b39200',
    700: '#806800',
    800: '#4e3e00',
    900: '#1c1500',
  },
}

const primary = 'cyan'
const secondary = 'pink'
const danger = 'red'

const overrides = {
  fonts,
  colors: {
    ...colors,
    colors: {
      pink: get(colors, 'pink.300'),
      cyan: get(colors, 'cyan.500'),
      green: get(colors, 'green.500'),
      orange: get(colors, 'orange.500'),
      yellow: get(colors, 'yellow.500'),
    },
    primary: get(colors, `${primary}.500`),
    secondary: get(colors, `${secondary}.300`),
    danger: get(colors, `${danger}.400`),
    text: get(colors, 'black'),
  },
  breakpoints,
  containerWidth,
  headerHeight: '60px',
}

const customTheme = extendTheme(overrides)

export default customTheme
