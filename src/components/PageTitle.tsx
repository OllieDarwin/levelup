import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface Props {
    title: string
}

const PageTitle = ({ title }: Props) => {
  const location = useLocation()

  useEffect(() => {
    document.title = "LevelUp - " + title
  }, [location, title])

  return null
}

export default PageTitle