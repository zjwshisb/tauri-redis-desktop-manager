import React from 'react'
import { Button, Form, InputNumber } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import context from '../../../context'
const IncrByFloat: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  const connection = React.useContext(context)

  return (
    <VersionAccess connection={connection} version="2.6.0">
      <ModalForm
        documentUrl="https://redis.io/commands/incrbyfloat/"
        title={t('INCRBYFLOAT')}
        width={400}
        trigger={<Button type="primary">{t('INCRBYFLOAT')}</Button>}
        onSubmit={async (v) => {
          await request('string/incrbyfloat', keys.connection_id, {
            db: keys.db,
            name: keys.name,
            value: v.value
          })
          onSuccess()
        }}
      >
        <Form.Item name={'value'} rules={[{ required: true }]} required>
          <InputNumber className="!w-full" />
        </Form.Item>
      </ModalForm>
    </VersionAccess>
  )
}
export default IncrByFloat
