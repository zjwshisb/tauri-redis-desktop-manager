import { Form, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import FieldInput from '@/components/FieldInput'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/FormListItem'
import { useTranslation } from 'react-i18next'

const SAdd: React.FC<{
  keys: APP.SetKey
  onSuccess: () => void
}> = (props) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      defaultValue={{
        value: [undefined]
      }}
      trigger={<Button type="primary">SADD</Button>}
      onSubmit={async (v) => {
        await request<number>('key/set/sadd', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'SADD'}
    >
      <FormListItem
        itemProps={{
          label: t('Item'),
          required: true
        }}
        name="value"
        renderItem={(field) => {
          return (
            <Form.Item
              name={[field.name]}
              required
              rules={[{ required: true }]}
            >
              <FieldInput />
            </Form.Item>
          )
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default SAdd
