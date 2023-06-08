import { Form, InputNumber, Button } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import CusModal from '@/components/CusModal'

const Index: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const [form] = useForm(undefined)

  return (
    <CusModal
      trigger={<Button type="primary">LTRIM</Button>}
      onOk={async () => {
        await form.validateFields().then(async (formData) => {
          await request<number>('key/list/ltrim', props.keys.connection_id, {
            name: props.keys.name,
            db: props.keys.db,
            ...formData
          }).then(() => {
            props.onSuccess()
          })
        })
      }}
      title={'LTRIM'}
      onClear={() => {
        form.resetFields()
      }}
    >
      <Form form={form} layout="horizontal" initialValues={{}}>
        <Form.Item
          name={'start'}
          label={'Start'}
          required
          rules={[{ required: true }]}
        >
          <InputNumber min={0}></InputNumber>
        </Form.Item>
        <Form.Item
          name={'stop'}
          label={'Stop'}
          required
          rules={[{ required: true }]}
        >
          <InputNumber min={0} max={props.keys.length - 1}></InputNumber>
        </Form.Item>
      </Form>
    </CusModal>
  )
}
export default Index
