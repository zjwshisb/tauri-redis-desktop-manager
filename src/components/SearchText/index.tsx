import React from 'react'

const SearchText: React.FC<{
  text: string
  search?: string
}> = ({ text, search }) => {
  const children = React.useMemo(() => {
    if (search !== undefined && search !== '') {
      const a = text.toLowerCase()
      const b = search.toLowerCase()
      const indexof = a.indexOf(b)
      if (indexof > -1) {
        const replace = `<span style="color:#FF6600;">${b}</span>`
        const reg = new RegExp(search, 'gi')
        return text.replace(reg, replace)
      }
    }
    return text
  }, [search, text])

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: children
      }}
    ></span>
  )
}
export default SearchText
