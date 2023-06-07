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
    <div className="flex color-white font-mono">
      {item.time !== undefined && (
        <div className="text-gray-400">{item.time}</div>
      )}
      {item.tags != null && item.tags.length > 0 && (
        <div className="mx-1">
          {item.tags.map((v) => {
            return (
              <div className="text-yellow-600 " key={v}>
                [{v}]
              </div>
            )
          })}
        </div>
      )}
      <div className="text-white">{item.message}</div>
    </div>
  )
}
export default Row
