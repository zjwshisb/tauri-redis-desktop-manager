import React from 'react'

import { Button, Form, Input } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import { useTranslation } from 'react-i18next'

const Add: React.FC<{
  keys: APP.HyperLogLogKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      defaultValue={{
        value: [undefined]
      }}
      title={'PFADD'}
      documentUrl="https://redis.io/commands/pfadd/"
      width={400}
      trigger={<Button type="primary">PFADD</Button>}
      onSubmit={async (v) => {
        await request('hyperloglog/pfadd', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <FormListItem
        name="value"
        itemProps={{
          label: 'Value'
        }}
        renderItem={({ name, ...restField }) => {
          return (
            <Form.Item
              {...restField}
              name={[name]}
              rules={[{ required: true }]}
            >
              <Input placeholder={t('Please Enter').toString()} />
            </Form.Item>
          )
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default Add
