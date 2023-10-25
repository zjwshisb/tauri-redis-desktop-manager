import { Form, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import FieldInput from '@/components/FieldInput'
import ModalForm from '@/components/ModalForm'

const SAdd: React.FC<{
  keys: APP.SetKey
  onSuccess: () => void
}> = (props) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      trigger={<Button type="primary">SADD</Button>}
      onSubmit={async (v) => {
        await request<number>('key/set/sadd', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          value: [v.value]
        })
        props.onSuccess()
      }}
      title={'SADD'}
    >
      <Form.Item
        name={'value'}
        label={t('Value')}
        required
        rules={[{ required: true }]}
      >
        <FieldInput />
      </Form.Item>
    </ModalForm>
  )
}
export default SAdd
