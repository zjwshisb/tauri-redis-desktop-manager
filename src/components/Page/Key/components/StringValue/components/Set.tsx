import React from 'react'
import { Button, Form } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'
import FieldInput from '@/components/InputJson'

const Set: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const [value, setValue] = React.useState(keys.data)

  const { t } = useTranslation()

  React.useEffect(() => {
    setValue(keys.data)
  }, [keys.data])

  return (
    <ModalForm
      documentUrl="https://redis.io/commands/set/"
      title={t('SET')}
      trigger={<Button type="primary">{t('SET')}</Button>}
      onSubmit={async (v) => {
        await request('string/set', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          value: v.value
        })
        onSuccess()
      }}
      defaultValue={{
        value
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
export default Set
