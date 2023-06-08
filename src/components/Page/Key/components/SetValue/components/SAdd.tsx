import { Form, Input, Button } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import CusModal from '@/components/CusModal'

const Index: React.FC<{
  keys: APP.SetKey
  onSuccess: () => void
}> = (props) => {
  const [form] = useForm()

  const { t } = useTranslation()

  return (
    <CusModal
      onClear={() => {
        form.resetFields()
      }}
      trigger={<Button type="primary">SADD</Button>}
      onOk={async () => {
        await form.validateFields().then(async (formData) => {
          await request<number>('key/set/sadd', props.keys.connection_id, {
            name: props.keys.name,
            db: props.keys.db,
            ...formData
          }).then(() => {
            props.onSuccess()
          })
        })
      }}
      title={'Insert'}
    >
      <Form form={form} layout="vertical" initialValues={{}}>
        <Form.Item
          name={'value'}
          label={t('Value')}
          required
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={20}></Input.TextArea>
        </Form.Item>
      </Form>
    </CusModal>
  )
}
export default Index
