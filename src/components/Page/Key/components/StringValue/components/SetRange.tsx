import React from 'react'
import { Button, Form, InputNumber } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'
import FieldInput from '@/components/FieldInput'

const SetRange: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      documentUrl="https://redis.io/commands/setrange/"
      title={t('SETRANGE')}
      trigger={<Button type="primary">{t('SETRANGE')}</Button>}
      onSubmit={async (v) => {
        await request('string/setrange', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        })
        onSuccess()
      }}
    >
      <Form.Item name={'field'} label={t('Offset')}>
        <InputNumber
          className="!w-200"
          stringMode
          precision={0}
          min={0}
        ></InputNumber>
      </Form.Item>
      <Form.Item
        name={'value'}
        label={t('Value')}
        rules={[{ required: true }]}
        required
      >
        <FieldInput />
      </Form.Item>
    </ModalForm>
  )
}
export default SetRange
