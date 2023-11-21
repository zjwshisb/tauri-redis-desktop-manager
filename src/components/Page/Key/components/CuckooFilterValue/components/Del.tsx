import React from 'react'

import { Button, Form } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import FieldInput from '@/components/InputJson'

const AddNx: React.FC<{
  keys: APP.CuckooFilterKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      title={'CF.DEL'}
      documentUrl="https://redis.io/commands/cf.del/"
      width={400}
      trigger={<Button type="primary">DEL</Button>}
      onSubmit={async (v) => {
        await request('cuckoo-filter/del', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <Form.Item
        name={'value'}
        label={t('Item')}
        required
        rules={[{ required: true }]}
      >
        <FieldInput />
      </Form.Item>
    </ModalForm>
  )
}
export default AddNx
