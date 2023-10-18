import { Modal, message, type ModalProps } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

const CusModal: React.FC<
  {
    trigger?: React.ReactElement
    showOkNotice?: boolean
    onOk: () => Promise<any>
    onOpenChange?: (v: boolean) => void
    onOpen?: () => void
    // the callback when modal close
    onClear?: () => void
  } & Omit<ModalProps, 'onOk'>
> = (props) => {
  const { onOk, onCancel, onOpen, showOkNotice = true, ...otherProps } = props

  const { t } = useTranslation()

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

  React.useEffect(() => {
    if (open && onOpen !== undefined) {
      onOpen()
    }
  }, [open, onOpen])

  React.useEffect(() => {
    if (!open) {
      if (otherProps.onClear !== undefined) {
        otherProps.onClear()
      }
    }
  }, [open, otherProps])

  const isOpen = React.useMemo(() => {
    if (otherProps.open !== undefined) {
      return otherProps.open
    }
    return open
  }, [open, otherProps.open])

  const onOpenChange = React.useCallback(
    (v: boolean) => {
      setOpen(v)
      if (otherProps.onOpenChange != null) {
        otherProps.onOpenChange(v)
      }
    },
    [otherProps]
  )

  return (
    <>
      {trigger}
      <Modal
        destroyOnClose
        confirmLoading={confirmLoading}
        onOk={() => {
          setConfirmLoading(true)
          onOk()
            .then(() => {
              if (showOkNotice) {
                message.success(t('Success'))
              }
              onOpenChange(false)
            })
            .catch(() => {})
            .finally(() => {
              setConfirmLoading(false)
            })
        }}
        open={isOpen}
        onCancel={(e) => {
          if (onCancel != null) {
            onCancel(e)
          }
          onOpenChange(false)
        }}
        {...otherProps}
      >
        <div className="pt-4">{otherProps.children}</div>
      </Modal>
    </>
  )
}
export default CusModal
