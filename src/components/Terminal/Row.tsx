import React from 'react'

export interface TerminalRow {
  time?: string
  message: string
  tags?: string[]
  id: string | number
  messageNode?: React.ReactNode
}

const Row: React.FC<{
  item: TerminalRow
}> = ({ item }) => {
  const message = React.useMemo(() => {
    if (item.messageNode !== undefined) {
      return item.messageNode
    }
    return item.message
  }, [item.message, item.messageNode])

  return (
    <div className="flex font-mono px-2 break-words">
      {item.time !== undefined && (
        <div className="flex-shrink-0 text-gray-800">{item.time}</div>
      )}
      {item.tags != null && item.tags.length > 0 && (
        <div className="ml-2 text-yellow-600 flex-shrink-0 ">
          {item.tags.map((v) => {
            return (
              <span className="" key={v}>
                [{v}]
              </span>
            )
          })}
        </div>
      )}
      <div className="ml-2 font-medium">{message}</div>
    </div>
  )
}
export default Row
