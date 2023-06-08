import { Modal, message, type ModalProps } from 'antd'
import React from 'react'

const CusModal: React.FC<
  {
    trigger: React.ReactElement
    showOkNotice?: boolean
    onOk: () => Promise<any>
    onOpen?: () => void
    onClear?: () => void
  } & Omit<ModalProps, 'onOk' | 'open'>
> = (props) => {
  const { onOk, onCancel, onOpen, showOkNotice = true, ...otherProps } = props

  const [open, setOpen] = React.useState(false)

  const [confirmLoading, setConfirmLoading] = React.useState(false)

  const trigger = React.cloneElement(props.trigger, {
    onClick() {
      setOpen(true)
    }
  })

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
                message.success('Success')
              }
              setOpen(false)
            })
            .catch(() => {})
            .finally(() => {
              setConfirmLoading(false)
            })
        }}
        open={open}
        onCancel={(e) => {
          if (onCancel != null) {
            onCancel(e)
          }
          setOpen(false)
        }}
        {...otherProps}
      >
        <div className="pt-4">{otherProps.children}</div>
      </Modal>
    </>
  )
}
export default CusModal
