import { Button, Card, Form } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import CusModal from '@/components/CusModal'
import { type FormInstance, type FormProps } from 'antd/lib'
import Link from '../Link'
import { LinkOutlined } from '@ant-design/icons'
import { isString } from 'lodash'
import { useTranslation } from 'react-i18next'

interface ModalQueryFormProps<T> {
  defaultValue?: Record<string, any>
  trigger: React.ReactElement
  onQuery: (value: Record<string, any>) => Promise<T>
  width?: string | number
  title?: React.ReactNode
  onFieldsChange?: FormProps['onFieldsChange']
  onValueChange?: FormProps['onValuesChange']
  onCancel?: () => void
  documentUrl?: string
  resultRender?: (v: T) => React.ReactNode
  ref?: React.ForwardedRef<FormInstance>
}
function ModalQueryForm<T>(
  props: React.PropsWithChildren<ModalQueryFormProps<T>>,
  ref: React.ForwardedRef<FormInstance>
) {
  const [form] = useForm()

  React.useImperativeHandle(ref, () => form)

  const { width = 800 } = props

  const { t } = useTranslation()

  const [result, setResult] = React.useState<T>()

  const resultNode = React.useMemo(() => {
    if (result !== undefined) {
      if (props.resultRender === undefined) {
        if (isString(result)) {
          return (
            <Form.Item label="Result">
              <Card bodyStyle={{ padding: 8 }}>{result}</Card>
            </Form.Item>
          )
        }
      } else {
        return props.resultRender(result)
      }
    }
    return <></>
  }, [props, result])

  return (
    <CusModal
      autoClose={false}
      onCancel={props.onCancel}
      showOkNotice={false}
      destroyOnClose
      width={width}
      footer={(_, { OkBtn, CancelBtn }) => (
        <div>
          <CancelBtn />
          <Button
            onClick={() => {
              setResult(undefined)
              form.resetFields()
            }}
          >
            {t('Reset')}
          </Button>
          <OkBtn />
        </div>
      )}
      onClear={() => {
        setResult(undefined)
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
        props.onQuery(v).then((res) => {
          setResult(res)
        })
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
        {resultNode}
      </Form>
    </CusModal>
  )
}

export default React.forwardRef(ModalQueryForm) as <T>(
  props: React.PropsWithChildren<ModalQueryFormProps<T>>
) => React.ReactElement
