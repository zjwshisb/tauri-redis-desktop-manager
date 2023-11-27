import { Modal, type ModalProps, App } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

const CusModal: React.FC<
  {
    trigger?: React.ReactElement
    showOkNotice?: boolean
    onOk: () => Promise<any>
    onOpenChange?: (v: boolean) => void
    afterOpen?: () => void
    beforeOpen?: () => void
    beforeClose?: () => void
    autoClose?: boolean
  } & Omit<ModalProps, 'onOk' | 'open'>
> = (props) => {
  const {
    onOk,
    onCancel,
    afterOpen,
    beforeClose,
    showOkNotice = true,
    autoClose = true,
    beforeOpen,
    ...otherProps
  } = props

  const { t } = useTranslation()

  const { message } = App.useApp()

  const [open, setOpen] = React.useState(false)

  const [confirmLoading, setConfirmLoading] = React.useState(false)

  const changeOpen = React.useCallback(
    (v: boolean) => {
      setOpen((p) => {
        if (!p && v && beforeOpen !== undefined) {
          beforeOpen()
        }
        if (p && !v && beforeClose !== undefined) {
          beforeClose()
        }
        return v
      })
    },
    [beforeClose, beforeOpen]
  )

  const trigger = React.useMemo(() => {
    if (otherProps.trigger !== undefined) {
      return React.cloneElement(props.trigger as React.ReactElement, {
        onClick(e: React.MouseEvent) {
          e.stopPropagation()
          changeOpen(true)
        }
      })
    }
    return <></>
  }, [changeOpen, otherProps.trigger, props.trigger])

  return (
    <>
      {trigger}
      <Modal
        afterOpenChange={(v) => {
          if (otherProps.onOpenChange != null) {
            otherProps.onOpenChange(v)
          }
          if (v) {
            if (afterOpen != null) {
              afterOpen()
            }
          }
        }}
        confirmLoading={confirmLoading}
        onOk={() => {
          setConfirmLoading(true)
          onOk()
            .then(() => {
              if (showOkNotice) {
                message.success(t('Success'))
              }
              if (autoClose) {
                changeOpen(false)
              }
            })
            .catch(() => {})
            .finally(() => {
              setConfirmLoading(false)
            })
        }}
        open={open}
        onCancel={(e) => {
          changeOpen(false)
          if (onCancel != null) {
            onCancel(e)
          }
        }}
        {...otherProps}
      >
        <div className="pt-4">{otherProps.children}</div>
      </Modal>
    </>
  )
}
export default CusModal
