import React from 'react'
import { red } from '@ant-design/colors'
const Error: React.FC<{
  message: string
}> = ({ message }) => {
  return (
    <div
      style={{
        color: red.primary
      }}
    >
      {message}
    </div>
  )
}
export default Error
