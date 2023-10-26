import React from 'react'

import { Button, Form, Input } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import FormListItem from '@/components/FormListItem/Index'

const Add: React.FC<{
  keys: APP.BloomFilterKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      defaultValue={{
        value: [undefined]
      }}
      title={'BF.MADD'}
      documentUrl="https://redis.io/commands/bf.madd/"
      width={400}
      trigger={<Button type="primary">MADD</Button>}
      onSubmit={async (v) => {
        await request('bloom-filter/madd', keys.connection_id, {
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
          tooltip: 'is an item to add.'
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
              <Input placeholder={t('Please Enter').toString()} />
            </Form.Item>
          )
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default Add
