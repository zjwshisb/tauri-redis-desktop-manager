import { Modal, type ModalProps, App } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

const CusModal: React.FC<
  {
    trigger?: React.ReactElement
    showOkNotice?: boolean
    onOk: () => Promise<any>
    onOpenChange?: (v: boolean) => void
    onOpen?: () => void
    onClear?: () => void
    autoClose?: boolean
  } & Omit<ModalProps, 'onOk'>
> = (props) => {
  const {
    onOk,
    onCancel,
    onOpen,
    showOkNotice = true,
    autoClose = true,
    ...otherProps
  } = props

  const { t } = useTranslation()

  const { message } = App.useApp()

  const [open, setOpen] = React.useState(false)

  const [confirmLoading, setConfirmLoading] = React.useState(false)

  const trigger = React.useMemo(() => {
    if (otherProps.trigger !== undefined) {
      return React.cloneElement(props.trigger as React.ReactElement, {
        onClick() {
          setOpen(true)
        }
      })
    }
    return <></>
  }, [otherProps.trigger, props.trigger])

  const isOpen = React.useMemo(() => {
    if (otherProps.open !== undefined) {
      return otherProps.open
    }
    return open
  }, [open, otherProps.open])

  return (
    <>
      {trigger}
      <Modal
        destroyOnClose
        afterOpenChange={(v) => {
          if (otherProps.onOpenChange != null) {
            otherProps.onOpenChange(v)
          }
          if (!v) {
            if (otherProps.onClear !== undefined) {
              otherProps.onClear()
            }
          } else {
            if (onOpen != null) {
              onOpen()
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
                setOpen(false)
              }
            })
            .catch(() => {})
            .finally(() => {
              setConfirmLoading(false)
            })
        }}
        open={isOpen}
        onCancel={(e) => {
          setOpen(false)
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
