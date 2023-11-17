import { Form, Button, Input } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/FormListItem'
import { useTranslation } from 'react-i18next'

const SInterStore: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      documentUrl="https://redis.io/commands/sinterstore/"
      defaultValue={{
        value: [keys.name, undefined]
      }}
      trigger={<Button type="primary">SINTERSTORE</Button>}
      onSubmit={async (v) => {
        await request<number>('set/sinterstore', keys.connection_id, {
          db: keys.db,
          ...v
        })
      }}
      title={'SINTERSTORE'}
    >
      <Form.Item
        label={t('Destination key')}
        name={'name'}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <FormListItem
        itemProps={{
          label: t('Keys'),
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
              <Input />
            </Form.Item>
          )
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default SInterStore
