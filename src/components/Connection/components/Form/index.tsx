import { Button, Form, Input, Modal, InputNumber, Space, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const Index: React.FC<{
  onSuccess: () => void
  connection?: APP.Connection
  trigger: React.ReactElement
}> = (props) => {
  const [visible, setVisible] = React.useState(false)

  const [form] = useForm()

  const { t } = useTranslation()

  const trigger = React.cloneElement(props.trigger, {
    onClick() {
      setVisible(true)
    }
  })
  React.useEffect(() => {
    if (props.connection != null) {
      form.setFieldsValue({
        ...props.connection
      })
    }
  }, [form, props.connection])

  return (
    <div>
      {trigger}
      <Modal
        title={
          props.connection != null ? t('Edit Connection') : t('New Connection')
        }
        bodyStyle={{
          paddingTop: '20px'
        }}
        footer={
          <Space>
            <Button
              onClick={() => {
                setVisible(false)
                form.resetFields()
              }}
            >
              {t('Cancel')}
            </Button>
            <Button
              onClick={() => {
                form
                  .validateFields()
                  .then((v) => {
                    request<string>('server/ping', 0, v)
                      .then((res) => {
                        if (res.data === 'PONG') {
                          message.success(t('Connect Success')).then(() => {})
                        }
                      })
                      .catch((err) => {
                        message.error(err).then(() => {})
                      })
                  })
                  .catch(() => {})
              }}
            >
              {t('Test Connection')}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                form.validateFields().then((v) => {
                  request('connections/add', 0, v).then((r) => {
                    message.success('操作成功')
                    props.onSuccess()
                    setVisible(false)
                  })
                })
              }}
            >
              {t('OK')}
            </Button>
          </Space>
        }
        open={visible}
        onCancel={() => {
          setVisible(false)
          form.resetFields()
        }}
        destroyOnClose
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          initialValues={{
            port: 6379,
            host: '127.0.0.1',
            auth: ''
          }}
        >
          <Form.Item name="host" label="Host" rules={[{ required: true }]}>
            <Input
              placeholder={t('Please Enter {{name}}', {
                name: 'Host'
              }).toString()}
            ></Input>
          </Form.Item>
          <Form.Item name="port" label="Port" rules={[{ required: true }]}>
            <InputNumber min={0}></InputNumber>
          </Form.Item>
          <Form.Item name="auth" label="Password">
            <Input
              placeholder={t('Please Enter {{name}}', {
                name: t('Password')
              }).toString()}
            ></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default Index
