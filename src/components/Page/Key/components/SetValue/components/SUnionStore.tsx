import { Form, Button, Input } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import { useTranslation } from 'react-i18next'
import FormInputItem from '@/components/Form/FormInputItem'

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
        label="Keys"
        required
        name="value"
        renderItem={(field) => {
          return <FormInputItem {...field} required />
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default SUnionStore
