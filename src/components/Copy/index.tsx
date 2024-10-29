import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import React from 'react'
import { App, type ButtonProps } from 'antd'
import { useTranslation } from 'react-i18next'
import CusButton from '../CusButton'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'

const Copy: React.FC<
  React.PropsWithChildren<{
    content: string
    className?: string
    style?: React.CSSProperties
    isButton?: boolean
    buttonProps?: ButtonProps
  }>
> = ({ content, className, style, children, isButton, buttonProps }) => {
  const [showSuccess, setShowSuccess] = React.useState(false)

  const { t } = useTranslation()

  const { message } = App.useApp()

  const copy = React.useCallback(async () => {
    await writeText(content)
    setShowSuccess(true)
    message.success(t('Copy Success'))
    setTimeout(() => {
      setShowSuccess(false)
    }, 1000)
  }, [content, message, t])

  const icon = React.useMemo(() => {
    if (showSuccess) {
      return <CheckOutlined style={style} />
    }
    return (
      <CopyOutlined
        className={className}
        style={style}
        onClick={() => {
          if (isButton !== true) {
            copy()
          }
        }}
      />
    )
  }, [className, isButton, copy, showSuccess, style])

  if (children !== undefined && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: copy
    })
  }

  if (isButton === true) {
    return <CusButton {...buttonProps} icon={icon} onClick={copy}></CusButton>
  }
  return icon
}
export default Copy
