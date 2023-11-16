import React from 'react'
import { Button, Form, InputNumber } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'

const IncrBy: React.FC<{
  keys: APP.StringKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      documentUrl="https://redis.io/commands/incrby/"
      title={t('INCRBY')}
      width={400}
      trigger={<Button type="primary">{t('INCRBY')}</Button>}
      onSubmit={async (v) => {
        await request('string/incrby', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          value: v.value
        })
        onRefresh()
      }}
      defaultValue={{}}
    >
      <Form.Item name={'value'} rules={[{ required: true }]} required>
        <InputNumber className="!w-full" precision={0} />
      </Form.Item>
    </ModalForm>
  )
}
export default IncrBy
