import { Form } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import CusModal from '@/components/CusModal'
import { type FormProps } from 'antd/lib'

const ModalForm: React.FC<
  React.PropsWithChildren<{
    defaultValue?: Record<string, any>
    trigger: React.ReactElement
    onSubmit: (value: Record<string, any>) => Promise<any>
    width?: string | number
    title?: React.ReactNode
    showOkNotice?: boolean
    onFieldsChange?: FormProps['onFieldsChange']
  }>
> = (props) => {
  const [form] = useForm()

  const { showOkNotice = true, width = 800 } = props

  return (
    <CusModal
      showOkNotice={showOkNotice}
      destroyOnClose
      width={width}
      onClear={() => {
        setTimeout(() => {
          form.resetFields()
        }, 100)
      }}
      onOpen={() => {
        form.setFieldsValue(props.defaultValue)
      }}
      trigger={props.trigger}
      onOk={async () => {
        const v = await form.validateFields()
        return await props.onSubmit(v)
      }}
      title={props.title}
    >
      <Form
        onFieldsChange={props.onFieldsChange}
        layout="vertical"
        form={form}
        initialValues={{
          ...props.defaultValue
        }}
      >
        {props.children}
      </Form>
    </CusModal>
  )
}
export default ModalForm
