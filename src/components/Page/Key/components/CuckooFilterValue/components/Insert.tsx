import React from 'react'

import { Button, Form } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormListItem from '@/components/FormListItem'
import FieldInput from '@/components/FieldInput'
import { useTranslation } from 'react-i18next'

const Insert: React.FC<{
  keys: APP.CuckooFilterKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      defaultValue={{
        value: [undefined]
      }}
      title={'CF.INSERT'}
      documentUrl="https://redis.io/commands/cf.insert/"
      width={400}
      trigger={<Button type="primary">INSERT</Button>}
      onSubmit={async (v) => {
        await request('cuckoo-filter/insert', keys.connection_id, {
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
export default Insert
