import { Button, Form } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import CusModal from '@/components/CusModal'
import { type FormInstance, type FormProps } from 'antd/lib'
import Link from '../Link'
import { LinkOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import XTerm, { type XTermAction } from '../XTerm'
import { useLatest } from 'ahooks'

interface ModalQueryFormProps<T> {
  defaultValue?: Record<string, any>
  trigger: React.ReactElement
  onQuery: (value: Record<string, any>) => Promise<T>
  onSuccess?: () => void
  width?: string | number
  title?: React.ReactNode
  onFieldsChange?: FormProps['onFieldsChange']
  onValueChange?: FormProps['onValuesChange']
  onCancel?: () => void
  documentUrl?: string
  ref?: React.ForwardedRef<FormInstance>
  queryWithOpen?: boolean
}

const welcome = 'Waiting for result...'

function ModalQueryForm<T>(
  props: React.PropsWithChildren<ModalQueryFormProps<T>>,
  ref: React.ForwardedRef<FormInstance>
) {
  const [form] = useForm()

  React.useImperativeHandle(ref, () => form)

  const { width = 800, queryWithOpen = false, onQuery, onSuccess } = props

  const term = React.useRef<XTermAction>(null)

  const { t } = useTranslation()

  const onQueryRef = useLatest(onQuery)

  const onSuccessRef = useLatest(onSuccess)

  const query = React.useCallback(async () => {
    const v = await form.validateFields()
    onQueryRef
      .current(v)
      .then((result) => {
        if (onSuccessRef.current != null) {
          onSuccessRef.current()
        }
        if (result !== undefined) {
          term.current?.clear()
          term.current?.writeRedisResult(result)
        }
      })
      .catch((e) => {
        term.current?.clear()
        term.current?.writeln(`(error) ${e as string} `)
      })
  }, [form, onQueryRef, onSuccessRef])

  return (
    <CusModal
      forceRender={false}
      autoClose={false}
      onCancel={props.onCancel}
      showOkNotice={false}
      width={width}
      footer={(_, { OkBtn, CancelBtn }) => (
        <div>
          <CancelBtn />
          <Button
            onClick={() => {
              term.current?.clear()
              term.current?.writeln(welcome)
              form.resetFields()
            }}
          >
            {t('Reset')}
          </Button>
          <OkBtn />
        </div>
      )}
      onClear={() => {
        term.current?.clear()
        term.current?.writeln(welcome)
        setTimeout(() => {
          form.resetFields()
        }, 100)
      }}
      onOpen={() => {
        form.setFieldsValue(props.defaultValue)
        if (queryWithOpen) {
          query()
        }
      }}
      trigger={props.trigger}
      onOk={query}
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
        <XTerm
          defaultHeight={200}
          minHeight={200}
          ref={term}
          onReady={(term) => {
            term.writeln(welcome)
          }}
        ></XTerm>
      </Form>
    </CusModal>
  )
}

export default React.forwardRef(ModalQueryForm) as <T>(
  props: React.PropsWithChildren<ModalQueryFormProps<T>>
) => React.ReactElement
