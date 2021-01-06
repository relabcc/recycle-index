import { useEffect } from "react"
import loader from "./loader"

const useLoader = (images) => {
  useEffect(() => {
    loader(images)
  }, [images])
}

export default useLoader
