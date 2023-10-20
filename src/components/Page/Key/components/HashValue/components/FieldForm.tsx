import { Form, Input } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import FieldInput from '@/components/FieldInput'
import ModalForm from '@/components/ModalForm'

const Index: React.FC<{
  keys: APP.HashKey
  field?: APP.HashField
  trigger: React.ReactElement
  onSuccess: (newField: APP.HashField) => void
}> = (props) => {
  const { t } = useTranslation()

  const isEdit = React.useMemo(() => {
    return props.field !== undefined
  }, [props.field])

  const title = React.useMemo(() => {
    return isEdit ? t('Edit Field') : t('Add Field')
  }, [isEdit, t])

  return (
    <ModalForm
      title={title}
      width={800}
      defaultValue={{
        field: props.field?.name,
        value: props.field?.value
      }}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('key/hash/hset', props.keys.connection_id, {
          name: props.keys.name,
          value: [v],
          db: props.keys.db
        }).then(() => {
          props.onSuccess({
            name: v.name,
            value: v.value
          })
        })
      }}
    >
      <Form.Item
        name={'field'}
        label={t('Field Name')}
        rules={[{ required: true }]}
      >
        <Input readOnly={isEdit}></Input>
      </Form.Item>
      <Form.Item
        name={'value'}
        label={t('Field Value')}
        rules={[{ required: true }]}
      >
        <FieldInput></FieldInput>
      </Form.Item>
    </ModalForm>
  )
}
export default Index
