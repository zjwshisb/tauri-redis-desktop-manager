import { Form, InputNumber } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import FieldInput from '@/components/FieldInput'
import ModalForm from '@/components/ModalForm'

const Index: React.FC<{
  keys: APP.ZSetKey
  field?: APP.Field
  onSuccess: () => void
  trigger: React.ReactElement
}> = (props) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      defaultValue={{
        value: props.field?.name,
        score: props.field?.value
      }}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('key/zset/zadd', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          value: v.value,
          score: parseFloat(v.score)
        })
        props.onSuccess()
      }}
      title={'ZADD'}
    >
      <Form.Item
        name={'value'}
        label={t('Value')}
        required
        rules={[{ required: true }]}
      >
        <FieldInput readOnly={props.field != null}></FieldInput>
      </Form.Item>
      <Form.Item
        name={'score'}
        label={t('Score')}
        required
        rules={[{ required: true }]}
      >
        <InputNumber
          className="!w-[200px]"
          placeholder={t('Please Enter {{name}}', {
            name: t('Score')
          }).toString()}
        ></InputNumber>
      </Form.Item>
    </ModalForm>
  )
}
export default Index
