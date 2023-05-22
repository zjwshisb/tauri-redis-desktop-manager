import { Button, Form, Input, Modal, InputNumber, Space, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import request from '../../utils/request'

const Index: React.FC<{
  onSuccess: () => void
}> = (props) => {
  const [visible, setVisible] = React.useState(false)

  const [form] = useForm()
  return <div className={'p-2'}>
        <Button block onClick={() => {
          setVisible(true)
        }}>new Connection</Button>
     <Modal title="new connection"
        bodyStyle={{
          paddingTop: '20px'
        }}
      footer={
        <Space>
            <Button onClick={() => {
              setVisible(false)
              form.resetFields()
            }}>cancel</Button>
            <Button onClick={() => {
              form.validateFields().then(v => {
                request<string>('server/ping', 0, v).then(res => {
                  if (res.data === 'PONG') {
                    message.success('connect success').then(() => {})
                  }
                }).catch(err => {
                  message.error(err).then(() => {})
                })
              }).catch(() => {})
            }}>test</Button>
            <Button type="primary" onClick={() => {
              form.validateFields().then(v => {
                request('connections/add', 0, v).then(r => {
                  message.success('操作成功')
                  props.onSuccess()
                  setVisible(false)
                })
              })
            }}>ok</Button>
        </Space>
      }
      open={visible}
      onCancel={() => {
        setVisible(false)
        form.resetFields()
      }}
      destroyOnClose>
        <Form form={form}
            initialValues={{
              port: 6379,
              host: '127.0.0.1',
              auth: ''
            }}>
            <Form.Item name="host" label="host" rules={[{ required: true }]}>
                <Input></Input>
            </Form.Item>
            <Form.Item name="port" label="port" rules={[{ required: true }]}>
                <InputNumber min={0} ></InputNumber>
            </Form.Item>
            <Form.Item name="auth" label="auth">
                <Input></Input>
            </Form.Item>
        </Form>
     </Modal>
    </div>
}
export default Index
