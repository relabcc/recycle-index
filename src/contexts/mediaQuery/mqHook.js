import { useMediaQuery } from 'react-responsive'

export default bp => {
  return useMediaQuery({ query: `(min-width: ${bp})` })
}
