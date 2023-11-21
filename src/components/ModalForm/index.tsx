import { Form } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import CusModal from '@/components/CusModal'
import { type FormInstance, type FormProps } from 'antd/lib'
import Link from '../Link'
import { LinkOutlined } from '@ant-design/icons'

const ModalForm: React.ForwardRefRenderFunction<
  FormInstance,
  React.PropsWithChildren<{
    defaultValue?: Record<string, any>
    trigger: React.ReactElement
    onSubmit: (value: Record<string, any>) => Promise<any>
    width?: string | number
    title?: React.ReactNode
    showOkNotice?: boolean
    onFieldsChange?: FormProps['onFieldsChange']
    onValueChange?: FormProps['onValuesChange']
    onCancel?: () => void
    documentUrl?: string
  }>
> = (props, ref: React.ForwardedRef<FormInstance>) => {
  const [form] = useForm()

  React.useImperativeHandle(ref, () => form)

  const { showOkNotice = true, width = 800 } = props

  return (
    <CusModal
      forceRender={false}
      destroyOnClose
      onCancel={props.onCancel}
      showOkNotice={showOkNotice}
      width={width}
      afterClose={() => {
        form.resetFields()
      }}
      beforeOpen={() => {
        form.setFieldsValue(props.defaultValue)
      }}
      trigger={props.trigger}
      onOk={async () => {
        const v = await form.validateFields()
        return await props.onSubmit(v)
      }}
      title={
        <div>
          {props.title}
          {props.documentUrl !== undefined && (
            <Link href={props.documentUrl} className="ml-2">
              <LinkOutlined />
            </Link>
          )}
        </div>
      }
    >
      <Form
        onValuesChange={props.onValueChange}
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
export default React.forwardRef(ModalForm)
