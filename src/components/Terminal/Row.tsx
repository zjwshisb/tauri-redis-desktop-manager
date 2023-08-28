import React from 'react'

export interface TerminalRow {
  time?: string
  message: React.ReactNode
  tags?: string[]
  id: string | number
}

const Row: React.FC<{
  item: TerminalRow
}> = ({ item }) => {
  return (
    <div className="flex font-mono px-2 break-words break-all">
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
      <div className="ml-2 font-medium">{item.message}</div>
    </div>
  )
}
export default Row
