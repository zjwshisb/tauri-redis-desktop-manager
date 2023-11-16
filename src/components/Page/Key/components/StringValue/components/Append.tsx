import React from 'react'
import { Button, Form } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'
import FieldInput from '@/components/FieldInput'

const Append: React.FC<{
  keys: APP.StringKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      documentUrl="https://redis.io/commands/append/"
      title={t('APPEND')}
      trigger={<Button type="primary">{t('APPEND')}</Button>}
      onSubmit={async (v) => {
        await request(
          'string/append',
          keys.connection_id,
          {
            db: keys.db,
            name: keys.name,
            ...v
          },
          { showNotice: false }
        )
        onRefresh()
      }}
    >
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
export default Append
