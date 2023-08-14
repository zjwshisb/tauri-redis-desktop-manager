import React from 'react'

export interface TerminalRow {
  time?: string
  message: string
  tags?: string[]
  id: string | number
}

const Row: React.FC<{
  item: TerminalRow
}> = ({ item }) => {
  return (
    <div className="flex color-white font-mono px-2">
      {item.time !== undefined && (
        <div className="text-gray-400 flex-shrink-0">{item.time}</div>
      )}
      {item.tags != null && item.tags.length > 0 && (
        <div className="ml-2">
          {item.tags.map((v) => {
            return (
              <div className="text-yellow-600 flex-shrink-0" key={v}>
                [{v}]
              </div>
            )
          })}
        </div>
      )}
      <div className="text-white ml-2">{item.message}</div>
    </div>
  )
}
export default Row
