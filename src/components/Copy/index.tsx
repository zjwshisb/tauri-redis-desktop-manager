import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import React from 'react'
import { clipboard } from '@tauri-apps/api'
import { type ButtonProps, message } from 'antd'
import { useTranslation } from 'react-i18next'
import CusButton from '../CusButton'
import classNames from 'classnames'

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

  const copy = React.useCallback(async () => {
    await clipboard.writeText(content)
    setShowSuccess(true)
    message.success(t('Copy Success'))
    setTimeout(() => {
      setShowSuccess(false)
    }, 1000)
  }, [content, t])

  const icon = React.useMemo(() => {
    if (showSuccess) {
      return (
        <CheckOutlined
          className={classNames([className, 'text-green-600'])}
          style={style}
        />
      )
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
