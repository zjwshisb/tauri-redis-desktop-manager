import {
  Button,
  Form,
  Input,
  Modal,
  InputNumber,
  Space,
  message,
  Checkbox,
  Col,
  Row,
  Divider
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import useStore from '@/hooks/useStore'
import { observer } from 'mobx-react-lite'
import { open } from '@tauri-apps/api/dialog'

const ConnectionForm: React.FC = () => {
  const [testLoading, setTestLoading] = React.useState(false)

  const [form] = useForm()

  const { t } = useTranslation()

  const store = useStore()

  const formItem = store.connection.getForm()
  const [isSsh, setIsSsh] = React.useState(false)

  React.useEffect(() => {
    if (formItem.open === true && formItem.item != null) {
      let ssh = false
      if (formItem.item.ssh_host !== null) {
        ssh = true
        setIsSsh(ssh)
      }
      form.setFieldsValue({
        ...formItem.item,
        ssh
      })
    } else {
      form.setFieldsValue({
        ssh: isSsh
      })
    }
  }, [form, formItem.item, formItem.open, isSsh])

  React.useEffect(() => {
    if (!isSsh) {
      form.setFieldsValue({
        ssh_host: null,
        ssh_passphrase: null,
        ssh_password: null,
        ssh_port: null,
        ssh_private_key: null,
        ssh_username: null
      })
    }
  }, [form, isSsh])

  return (
    <Modal
      width={800}
      open={formItem.open}
      forceRender={true}
      getContainer={() => {
        return document.getElementsByTagName('body')[0]
      }}
      title={
        formItem.item !== undefined ? t('Edit Connection') : t('New Connection')
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
        setIsSsh(false)
      }}
      destroyOnClose
    >
      <Form
        form={form}
        layout={'vertical'}
        onValuesChange={(v) => {
          if (v.ssh !== undefined) {
            setIsSsh(v.ssh)
          }
        }}
        initialValues={{
          port: 6379,
          host: '127.0.0.1',
          password: '',
          username: '',
          is_cluster: false,
          readonly: false
        }}
      >
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              name="host"
              label={t('Host')}
              rules={[{ required: true }]}
            >
              <Input
                placeholder={t('Please Enter {{name}}', {
                  name: 'Host'
                }).toString()}
              ></Input>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="port"
              label={t('Port')}
              rules={[{ required: true }]}
            >
              <InputNumber min={0} className="!w-full"></InputNumber>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item
              tooltip={t('Other node will auto discover')}
              name="is_cluster"
              label={t('Cluster Mode')}
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              tooltip={t('Any action may change the value will be prohibited')}
              name="readonly"
              label={t('Readonly Mode')}
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              tooltip={t('SSH Tunnel')}
              name="ssh"
              label={t('SSH')}
              valuePropName="checked"
            >
              <Checkbox checked={isSsh} />
            </Form.Item>
          </Col>
        </Row>
        {isSsh && (
          <>
            <Divider orientation="left">{t('SSH Tunnel')}</Divider>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name="ssh_host"
                  label={t('Host')}
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Input
                    placeholder={t('Please Enter {{name}}', {
                      name: t('Host')
                    }).toString()}
                  ></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ssh_port"
                  label={t('Port')}
                  required={true}
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <InputNumber
                    className="!w-full"
                    max={99999}
                    placeholder={t('Please Enter {{name}}', {
                      name: t('Port')
                    }).toString()}
                  ></InputNumber>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name="ssh_username"
                  label={t('Username')}
                  rules={[
                    {
                      required: true,
                      max: 255
                    }
                  ]}
                >
                  <Input
                    placeholder={t('Please Enter {{name}}', {
                      name: t('Username')
                    }).toString()}
                  ></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ssh_password"
                  label={t('Password')}
                  dependencies={['ssh_private_key']}
                  rules={[
                    ({ getFieldValue }) => ({
                      async validator(_, value) {
                        if (
                          value == null &&
                          getFieldValue('ssh_private_key') == null
                        ) {
                          return await Promise.reject(
                            new Error(
                              t('Password Or Private Key Required').toString()
                            )
                          )
                        }
                        await Promise.resolve()
                      }
                    })
                  ]}
                >
                  <Input
                    placeholder={t('Please Enter {{name}}', {
                      name: t('Password')
                    }).toString()}
                  ></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item name="ssh_private_key" label={t('Private Key')}>
                  <Input
                    onClick={() => {
                      open({ multiple: false }).then((r) => {
                        form.setFieldValue('ssh_private_key', r)
                      })
                    }}
                    readOnly
                    placeholder={t('Please Select {{name}}', {
                      name: t('Private Key')
                    }).toString()}
                  ></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="ssh_passphrase" label={t('Passphrase')}>
                  <Input
                    placeholder={t('Please Enter {{name}}', {
                      name: t('Passphrase')
                    }).toString()}
                  ></Input>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  )
}
export default observer(ConnectionForm)
