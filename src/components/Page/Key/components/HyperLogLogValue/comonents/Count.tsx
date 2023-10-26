import React from 'react'

import { Button, Form, Input } from 'antd'
import request from '@/utils/request'
import FormListItem from '@/components/FormListItem'
import { useTranslation } from 'react-i18next'
import ModalQueryForm from '@/components/ModalQueryForm'

const Add: React.FC<{
  keys: APP.HyperLogLogKey
}> = ({ keys }) => {
  const { t } = useTranslation()

  return (
    <ModalQueryForm
      defaultValue={{
        name: [keys.name]
      }}
      title={'PFCOUNT'}
      documentUrl="https://redis.io/commands/pfcount/"
      width={400}
      trigger={<Button type="primary">PFCOUNT</Button>}
      onQuery={async (v) => {
        const res = await request('hyperloglog/pfcount', keys.connection_id, {
          db: keys.db,
          ...v
        })
        return res.data
      }}
    >
      <FormListItem
        name="name"
        itemProps={{
          label: 'Name'
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
    </ModalQueryForm>
  )
}
export default Add
