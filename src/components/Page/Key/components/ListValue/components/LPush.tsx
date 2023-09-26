import { Form, Input, Button } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import CusModal from '@/components/CusModal'

const LPush: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const [form] = useForm()

  return (
    <CusModal
      trigger={<Button type="primary">LPUSH</Button>}
      onOk={async () => {
        await form.validateFields().then(async (formData) => {
          await request<number>('key/list/lpush', props.keys.connection_id, {
            name: props.keys.name,
            db: props.keys.db,
            ...formData
          }).then(() => {
            props.onSuccess()
          })
        })
      }}
      title={'LPUSH'}
      onClear={() => {
        form.resetFields()
      }}
    >
      <Form form={form} layout="vertical" initialValues={{}}>
        <Form.Item
          name={'value'}
          label={'Value'}
          required
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={20}></Input.TextArea>
        </Form.Item>
      </Form>
    </CusModal>
  )
}
export default LPush
