import { Form } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import CusModal from '@/components/CusModal'
import { type FormInstance, type FormProps } from 'antd/lib'
import Link from '../Link'
import { LinkOutlined } from '@ant-design/icons'
import { isString } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useTrigger } from '@/components/ModalForm/useTrigger'

const ModalForm: React.ForwardRefRenderFunction<
  FormInstance,
  React.PropsWithChildren<{
    defaultValue?: Record<string, any>
    trigger?: React.ReactElement | string
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

  const { showOkNotice = true, width = 800, title } = props

  const { t } = useTranslation()

  const titleI18n = React.useMemo(() => {
    if (isString(title)) {
      return t(title)
    }
    return title
  }, [t, title])

  const trigger: React.ReactElement = useTrigger(props.trigger, props.title)

  return (
    <CusModal
      forceRender={false}
      destroyOnClose
      onCancel={props.onCancel}
      styles={{
        body: {
          padding: "10px"
        }
      }}
      showOkNotice={showOkNotice}
      width={width}
      afterClose={() => {
        form.resetFields()
      }}
      beforeOpen={() => {
        form.setFieldsValue(props.defaultValue)
      }}
      trigger={trigger}
      onOk={async () => {
        const v = await form.validateFields()
        return await props.onSubmit(v)
      }}
      title={
        <div>
          {titleI18n}
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
