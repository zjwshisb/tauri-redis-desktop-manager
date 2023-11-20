import { useLatest } from 'ahooks'
import { Button, type ButtonProps, App } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Link from '../Link'
import { LinkOutlined } from '@ant-design/icons'

const ButtonAction: React.FC<
  Omit<ButtonProps, 'onClick' | 'loading'> & {
    onSubmit: () => Promise<any>
    showConfirm?: boolean
    documentUrl?: string
    title?: string
  }
> = (props) => {
  const [loading, setLoading] = React.useState(false)

  const { t } = useTranslation()

  const { modal, message } = App.useApp()

  const { showConfirm = true, onSubmit, documentUrl, ...buttonProps } = props

  const handle = useLatest(async (loading: boolean) => {
    if (loading) {
      setLoading(true)
    }
    try {
      await onSubmit()
      message.success(t('Success'))
    } catch (e) {}
    if (loading) {
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }
  })

  return (
    <Button
      {...buttonProps}
      loading={loading}
      onClick={() => {
        if (showConfirm) {
          modal.confirm({
            title: props.title,
            content: (
              <div>
                <span>{t('Are you sure do this action?')}</span>
                {documentUrl !== undefined && (
                  <Link href={documentUrl} className="ml-2">
                    <LinkOutlined />
                  </Link>
                )}
              </div>
            ),
            async onOk() {
              await handle.current(false)
            }
          })
        } else {
          handle.current(true)
        }
      }}
    >
      {props.children}
    </Button>
  )
}
export default ButtonAction
