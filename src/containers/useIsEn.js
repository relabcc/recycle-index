import { useContext } from 'react'
import { EnContext } from './Layout'

const useIsEn = () => useContext(EnContext)

export default useIsEn
