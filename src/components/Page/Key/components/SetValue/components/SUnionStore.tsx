import { Form, Button, Input } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/FormListItem'
import { useTranslation } from 'react-i18next'

const SUnionStore: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      documentUrl="https://redis.io/commands/sunionstore/"
      defaultValue={{
        value: [keys.name, undefined]
      }}
      trigger={<Button type="primary">SUNIONSTORE</Button>}
      onSubmit={async (v) => {
        await request<number>('set/sunionstore', keys.connection_id, {
          db: keys.db,
          ...v
        })
      }}
      title={'SUNIONSTORE'}
    >
      <Form.Item
        label={t('Destination')}
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
export default SUnionStore
