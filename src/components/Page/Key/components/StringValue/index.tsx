import React from 'react'
import { Button, Card, Form } from 'antd'
import FieldViewer from '@/components/FieldViewer'
import request from '@/utils/request'
import ValueLayout from '../ValueLayout'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'
import FieldInput from '@/components/FieldInput'

const StringValue: React.FC<{
  keys: APP.StringKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const [value, setValue] = React.useState(keys.data)

  const { t } = useTranslation()

  React.useEffect(() => {
    setValue(keys.data)
  }, [keys.data])

  return (
    <ValueLayout
      actions={
        <ModalForm
          title={t('Edit')}
          trigger={<Button type="primary">{t('Edit')}</Button>}
          onSubmit={async (v) => {
            await request('key/set', keys.connection_id, {
              db: keys.db,
              name: keys.name,
              value: v.value
            })
            onRefresh()
          }}
          defaultValue={{
            value
          }}
        >
          <Form.Item name={'value'} rules={[{ required: true }]} required>
            <FieldInput />
          </Form.Item>
        </ModalForm>
      }
    >
      <Card bodyStyle={{ padding: 8 }}>
        <FieldViewer content={value}></FieldViewer>
      </Card>
    </ValueLayout>
  )
}
export default StringValue
