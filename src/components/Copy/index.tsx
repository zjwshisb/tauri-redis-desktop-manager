import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import React from 'react'
import { clipboard } from '@tauri-apps/api'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'

const Copy: React.FC<
  React.PropsWithChildren<{
    content: string
    className?: string
    style?: React.CSSProperties
  }>
> = ({ content, className, style, children }) => {
  const [showSuccess, setShowSuccess] = React.useState(false)

  const { t } = useTranslation()

  const onCopy = React.useCallback(async () => {
    await clipboard.writeText(content)
    setShowSuccess(true)
    message.success(t('Copy Success'))
    setTimeout(() => {
      setShowSuccess(false)
    }, 1000)
  }, [content, t])

  if (children !== undefined && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: onCopy
    })
  }

  if (showSuccess) {
    return <CheckOutlined className={className} />
  }

  return <CopyOutlined className={className} style={style} onClick={onCopy} />
}
export default Copy
