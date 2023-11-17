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
  width?: string | number
  title?: React.ReactNode
  onFieldsChange?: FormProps['onFieldsChange']
  onValueChange?: FormProps['onValuesChange']
  afterQueryClose?: () => void
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

  const { width = 800, queryWithOpen = false, onQuery, afterQueryClose } = props

  const term = React.useRef<XTermAction>(null)

  const { t } = useTranslation()

  const onQueryRef = useLatest(onQuery)

  const [isQuerySuccess, setIsQuerySuccess] = React.useState(false)

  const query = React.useCallback(async () => {
    const v = await form.validateFields()
    onQueryRef
      .current(v)
      .then((result) => {
        setIsQuerySuccess(true)
        if (result !== undefined) {
          term.current?.clear()
          term.current?.writeRedisResult(result)
        }
      })
      .catch((e) => {
        term.current?.clear()
        term.current?.writeln(`(error) ${e as string} `)
      })
  }, [form, onQueryRef])

  const clear = React.useCallback(() => {
    term.current?.clear()
    term.current?.writeln(welcome)
    form.resetFields()
  }, [form])

  return (
    <CusModal
      forceRender={false}
      destroyOnClose
      autoClose={false}
      onCancel={props.onCancel}
      showOkNotice={false}
      cancelText={t('Close')}
      width={width}
      footer={(_, { OkBtn, CancelBtn }) => (
        <div>
          <CancelBtn />
          <Button onClick={clear}>{t('Reset')}</Button>
          <OkBtn />
        </div>
      )}
      afterClose={() => {
        clear()
        if (isQuerySuccess && afterQueryClose !== undefined) {
          afterQueryClose()
        }
      }}
      afterOpen={() => {
        if (queryWithOpen) {
          query()
        }
      }}
      beforeOpen={() => {
        form.setFieldsValue(props.defaultValue)
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
