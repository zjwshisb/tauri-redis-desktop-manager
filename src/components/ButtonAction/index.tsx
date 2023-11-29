import { useLatest } from 'ahooks'
import { type ButtonProps, App } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Link from '../Link'
import { LinkOutlined } from '@ant-design/icons'
import { isString } from 'lodash'
import CusButton from '../CusButton'

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

  const {
    showConfirm = true,
    onSubmit,
    documentUrl,
    title,
    children,
    ...buttonProps
  } = props

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

  const titleI18n = React.useMemo(() => {
    if (isString(title)) {
      return t(title)
    }
    return title
  }, [title, t])

  const childrenI18n = React.useMemo(() => {
    if (isString(children)) {
      return t(children)
    }
    return children
  }, [children, t])

  return (
    <CusButton
      {...buttonProps}
      loading={loading}
      onClick={() => {
        if (showConfirm) {
          modal.confirm({
            title: (
              <div>
                {titleI18n}
                {documentUrl !== undefined && (
                  <Link href={documentUrl} className="ml-2">
                    <LinkOutlined />
                  </Link>
                )}
              </div>
            ),
            content: <div>{t('Are you sure do this action?')}</div>,
            async onOk() {
              await handle.current(false)
            }
          })
        } else {
          handle.current(true)
        }
      }}
    >
      {childrenI18n}
    </CusButton>
  )
}
export default ButtonAction
