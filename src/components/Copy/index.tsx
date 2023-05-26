import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { green } from '@ant-design/colors'

const Index: React.FC<{
  content: string
}> = ({ content }) => {
  const [showSuccess, setShowSuccess] = React.useState(false)

  if (showSuccess) {
    return <CheckOutlined style={{ color: green.primary }} />
  }
  return (
    <CopyToClipboard
      text={content}
      onCopy={(e, r: boolean) => {
        if (r) {
          setShowSuccess(true)
          setTimeout(() => {
            setShowSuccess(false)
          }, 2000)
        }
      }}
    >
      <CopyOutlined />
    </CopyToClipboard>
  )
}
export default Index
