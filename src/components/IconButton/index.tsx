import React from 'react'
import { blue } from '@ant-design/colors'

const IconButton: React.FC<{
  icon: React.ReactElement
  onClick?: () => void
}> = ({ icon, onClick }) => {
  const children = React.cloneElement(icon, {
    className: 'hover:cursor-point',
    style: {
      fontSize: '14px',
      color: blue.primary
    },
    onClick
  })

  return children
}
export default IconButton
