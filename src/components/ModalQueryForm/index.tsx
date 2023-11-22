import { Form } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import CusModal from '@/components/CusModal'
import { type FormInstance, type FormProps } from 'antd/lib'
import Link from '../Link'
import { LinkOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import XTerm, { type XTermAction } from '../XTerm'
import { useLatest } from 'ahooks'
import { isString } from 'lodash'
import CusButton from '../CusButton'

interface ModalQueryFormProps<T> {
  defaultValue?: Record<string, any>
  trigger?: React.ReactElement | string
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

const welcome = 'Waiting for Query...'

function ModalQueryForm<T>(
  props: React.PropsWithChildren<ModalQueryFormProps<T>>,
  ref: React.ForwardedRef<FormInstance>
) {
  const [form] = useForm()

  React.useImperativeHandle(ref, () => form)

  const {
    width = 800,
    queryWithOpen = false,
    onQuery,
    afterQueryClose,
    title
  } = props

  const term = React.useRef<XTermAction>(null)

  const { t } = useTranslation()

  const onQueryRef = useLatest(onQuery)

  const [isQuerySuccess, setIsQuerySuccess] = React.useState(false)

  const titleI18n = React.useMemo(() => {
    if (isString(title)) {
      return t(title)
    }
    return title
  }, [t, title])

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

  const trigger: React.ReactElement = React.useMemo(() => {
    if (props.trigger !== undefined) {
      if (isString(props.trigger)) {
        return <CusButton>{props.trigger}</CusButton>
      }
      return props.trigger
    } else {
      if (isString(props.title)) {
        return <CusButton>{props.title}</CusButton>
      }
    }
    return <></>
  }, [props.title, props.trigger])

  return (
    <CusModal
      forceRender={false}
      destroyOnClose
      autoClose={false}
      onCancel={props.onCancel}
      showOkNotice={false}
      trigger={trigger}
      cancelText={t('Close')}
      width={width}
      footer={(_, { OkBtn, CancelBtn }) => (
        <div>
          <CancelBtn />
          <CusButton onClick={clear} type="default">
            Reset
          </CusButton>
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
      onOk={query}
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
