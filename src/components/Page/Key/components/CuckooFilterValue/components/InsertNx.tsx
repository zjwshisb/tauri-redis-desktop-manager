import React from 'react'

import { Button, Form } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormListItem from '@/components/FormListItem'
import FieldInput from '@/components/FieldInput'
import { useTranslation } from 'react-i18next'

const InsertNx: React.FC<{
  keys: APP.CuckooFilterKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      defaultValue={{
        value: [undefined]
      }}
      title={'CF.INSERTNX'}
      documentUrl="https://redis.io/commands/cf.insertnx/"
      width={400}
      trigger={<Button type="primary">INSERTNX</Button>}
      onSubmit={async (v) => {
        await request('cuckoo-filter/insertnx', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <FormListItem
        itemProps={{
          tooltip: 'is an item to add.',
          label: t('Item').toString(),
          required: true,
          rules: [{ required: true }]
        }}
        name="value"
        renderItem={({ key, name, ...restField }) => {
          return (
            <Form.Item
              {...restField}
              name={[name]}
              required={true}
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
export default InsertNx
