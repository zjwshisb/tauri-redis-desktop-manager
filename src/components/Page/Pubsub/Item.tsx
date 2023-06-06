import React from 'react'

const Item: React.FC<{
  message: APP.EventPayload<APP.PubsubMessage>
}> = ({ message }) => {
  return (
    <div className="flex color-white font-mono">
      <div className="text-gray-400">{message.time}</div>
      <div className="text-yellow-600 mx-1">[{message.data.channel}]</div>
      <div className="text-white">{message.data.payload}</div>
    </div>
  )
}
export default Item
