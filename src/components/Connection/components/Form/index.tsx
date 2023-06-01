import { Button, Form, Input, Modal, InputNumber, Space, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import useStore from '@/hooks/useStore'

const Index: React.FC<{
  onSuccess: () => void
  connection?: APP.Connection
  trigger: React.ReactElement
}> = (props) => {
  const [visible, setVisible] = React.useState(false)

  const [form] = useForm()

  const { t } = useTranslation()

  const store = useStore()

  const trigger = React.cloneElement(props.trigger, {
    onClick() {
      setVisible(true)
    }
  })
  React.useEffect(() => {
    if (visible && props.connection != null) {
      form.setFieldsValue({
        ...props.connection
      })
    }
  }, [form, props.connection, visible])

  return (
    <div>
      {trigger}
      <Modal
        getContainer={() => {
          return document.getElementsByTagName('body')[0]
        }}
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
                    request<string>('server/ping', 0, v).then((res) => {
                      if (res.data === 'PONG') {
                        message.success(t('Connect Success')).then(() => {})
                      }
                    })
                  })
                  .catch(() => {})
              }}
            >
              {t('Test Connection')}
            </Button>
            <Button
              type="primary"
              onClick={async () => {
                const v = await form.validateFields()
                if (props.connection == null) {
                  await request('connections/add', 0, v)
                } else {
                  await request('connections/update', 0, {
                    ...v,
                    id: props.connection.id
                  })
                }
                store.connection.fetchConnections()
                message.success('操作成功')
                props.onSuccess()
                setVisible(false)
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
            password: ''
          }}
        >
          <Form.Item name="host" label={t('Host')} rules={[{ required: true }]}>
            <Input
              placeholder={t('Please Enter {{name}}', {
                name: 'Host'
              }).toString()}
            ></Input>
          </Form.Item>
          <Form.Item name="port" label={t('Port')} rules={[{ required: true }]}>
            <InputNumber min={0}></InputNumber>
          </Form.Item>
          <Form.Item name="password" label={t('Password')}>
            <Input.Password
              onClick={(e) => {
                e.stopPropagation()
              }}
              placeholder={t('Please Enter {{name}}', {
                name: t('Password')
              }).toString()}
            ></Input.Password>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default Index
