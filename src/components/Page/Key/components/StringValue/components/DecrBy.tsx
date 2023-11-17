import React from 'react'
import { Button, Form, InputNumber } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'

const DecrBy: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      documentUrl="https://redis.io/commands/decrby/"
      title={t('DECRBY')}
      width={400}
      trigger={<Button type="primary">{t('DECRBY')}</Button>}
      onSubmit={async (v) => {
        await request('string/decrby', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        })
        onSuccess()
      }}
    >
      <Form.Item name={'value'} rules={[{ required: true }]} required>
        <InputNumber className="!w-full" precision={0} />
      </Form.Item>
    </ModalForm>
  )
}
export default DecrBy
