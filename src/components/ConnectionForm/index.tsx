import {
  Button,
  Form,
  Input,
  Modal,
  InputNumber,
  Space,
  message,
  Checkbox
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import useStore from '@/hooks/useStore'
import { observer } from 'mobx-react-lite'

const ConnectionForm: React.FC = (props) => {
  const [testLoading, setTestLoading] = React.useState(false)

  const [form] = useForm()

  const { t } = useTranslation()

  const store = useStore()

  const formItem = store.connection.getForm()

  React.useEffect(() => {
    if (formItem.open && formItem.item != null) {
      form.setFieldsValue({
        ...formItem.item
      })
    }
  }, [form, formItem.item, formItem.open])

  return (
    <div>
      <Modal
        open={formItem.open}
        getContainer={() => {
          return document.getElementsByTagName('body')[0]
        }}
        title={
          formItem.item !== undefined
            ? t('Edit Connection')
            : t('New Connection')
        }
        bodyStyle={{
          paddingTop: '20px'
        }}
        footer={
          <Space>
            <Button
              onClick={() => {
                store.connection.closeForm()
                form.resetFields()
              }}
            >
              {t('Cancel')}
            </Button>
            <Button
              loading={testLoading}
              onClick={() => {
                form
                  .validateFields()
                  .then((v) => {
                    setTestLoading(true)
                    if (v.password === '') {
                      delete v.password
                    }
                    request<string>('server/ping', 0, v)
                      .then((res) => {
                        if (res.data === 'PONG') {
                          message.success(t('Connect Success')).then(() => {})
                        }
                      })
                      .finally(() => {
                        setTestLoading(false)
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
                if (v.password === '') {
                  delete v.password
                }
                if (formItem.item === undefined) {
                  const res = await request<APP.Connection>(
                    'connections/add',
                    0,
                    v
                  )
                  store.connection.add(res.data)
                } else {
                  const res = await request<APP.Connection>(
                    'connections/update',
                    0,
                    {
                      ...v,
                      id: formItem.item.id
                    }
                  )
                  if (formItem.item.open === true) {
                    store.connection.close(formItem.item.id)
                  }
                  store.connection.update(formItem.item.id, res.data)
                }
                store.connection.closeForm()
                message.success(t('Success'))
              }}
            >
              {t('OK')}
            </Button>
          </Space>
        }
        onCancel={() => {
          store.connection.closeForm()
          form.resetFields()
        }}
        destroyOnClose
      >
        <Form
          form={form}
          labelCol={{ span: 7 }}
          initialValues={{
            port: 6379,
            host: '127.0.0.1',
            password: '',
            is_cluster: false,
            readonly: false
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

          <Form.Item name="username" label={t('Username')}>
            <Input
              onClick={(e) => {
                e.stopPropagation()
              }}
              placeholder={t('Please Enter {{name}}', {
                name: t('Username')
              }).toString()}
            ></Input>
          </Form.Item>

          <Form.Item
            tooltip={t('Other node will auto discover')}
            name="is_cluster"
            label={t('Cluster Mode')}
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            tooltip={t('Any action may change the value will be prohibited')}
            name="readonly"
            label={t('Readonly Mode')}
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default observer(ConnectionForm)
