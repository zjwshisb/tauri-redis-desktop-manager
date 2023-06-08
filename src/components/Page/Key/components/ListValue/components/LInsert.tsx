import { Form, Input, Button, Radio } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import CusModal from '@/components/CusModal'

const Index: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const [form] = useForm()

  return (
    <>
      <CusModal
        trigger={<Button type="primary">LINSERT</Button>}
        onOk={async () => {
          await form.validateFields().then(async (formData) => {
            await request<number>(
              'key/list/linsert',
              props.keys.connection_id,
              {
                name: props.keys.name,
                db: props.keys.db,
                types: 'BEFORE',
                ...formData
              }
            ).then(() => {
              props.onSuccess()
            })
          })
        }}
        title={'LINSERT'}
        onClear={() => {
          form.resetFields()
        }}
      >
        <Form form={form} layout="vertical" initialValues={{}}>
          <Form.Item
            name={'pivot'}
            label={'Pivot'}
            required
            rules={[{ required: true }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item name={'types'} label={'Type'} rules={[{ required: true }]}>
            <Radio.Group
              optionType="button"
              options={[
                { label: 'BEFORE', value: 'BEFORE' },
                { label: 'AFTER', value: 'AFTER' }
              ]}
            ></Radio.Group>
          </Form.Item>
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
    </>
  )
}
export default Index
