import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Copy: React.FC<{
  content: string
  className?: string
  style?: React.CSSProperties
}> = ({ content, className, style }) => {
  const [showSuccess, setShowSuccess] = React.useState(false)

  if (showSuccess) {
    return <CheckOutlined />
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
      <CopyOutlined className={className} style={style} />
    </CopyToClipboard>
  )
}
export default Copy
