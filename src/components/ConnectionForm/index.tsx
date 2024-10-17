import { Form, Modal, Space, Row, Divider, App } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import useStore from '@/hooks/useStore'
import { observer } from 'mobx-react-lite'
import { open } from '@tauri-apps/plugin-dialog'

import FormInputItem from '../Form/FormInputItem'
import FormInputNumberItem from '../Form/FormInputNumberItem'
import FormInputPasswordItem from '../Form/FormInputPasswordItem'
import FormCheckBoxItem from '../Form/FormCheckBoxItem'
import CusButton from '../CusButton'

const ConnectionForm: React.FC = () => {
  const [testLoading, setTestLoading] = React.useState(false)

  const [form] = useForm()

  const { t } = useTranslation()

  const store = useStore()

  const formItem = store.connection.getForm()
  const [isSsh, setIsSsh] = React.useState(false)

  const { message } = App.useApp()

  React.useEffect(() => {
    if (formItem.open && formItem.item != null) {
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
      afterOpenChange={(v) => {
        if (!v) {
          form.resetFields()
          setIsSsh(false)
        }
      }}
      getContainer={() => {
        return document.getElementsByTagName('body')[0]
      }}
      title={
        formItem.item !== undefined ? t('Edit Connection') : t('New Connection')
      }
      footer={
        <Space>
          <CusButton
            type={'default'}
            onClick={() => {
              store.connection.closeForm()
              form.resetFields()
            }}
          >
            Cancel
          </CusButton>
          <CusButton
            type={'default'}
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
            Test Connection
          </CusButton>
          <CusButton
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
            OK
          </CusButton>
        </Space>
      }
      onCancel={() => {
        store.connection.closeForm()
      }}
      destroyOnClose
    >
      <Form
        size="middle"
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
          <FormInputItem
            span={12}
            name="host"
            label="Host"
            required
            rules={[{ max: 512 }]}
          />
          <FormInputNumberItem
            span={12}
            name="port"
            label={'Port'}
            required
            inputProps={{
              precision: 0,
              min: 0,
              max: 65536
            }}
          />
        </Row>
        <Row gutter={20}>
          <FormInputItem
            span={12}
            name="name"
            label="Name"
            tooltip="The name for Connection"
            rules={[
              {
                max: 255
              }
            ]}
          />
        </Row>
        <Row gutter={20}>
          <FormInputPasswordItem span={12} name="password" label="Password" />
          <FormInputItem span={12} name="username" label="Username" />
        </Row>
        <Row gutter={20}>
          <FormCheckBoxItem
            span={6}
            tooltip="Other node will auto discover"
            name="is_cluster"
            label="Cluster Mode"
          />
          <FormCheckBoxItem
            span={6}
            tooltip="Any action may change the value will be prohibited"
            name="readonly"
            label="Readonly Mode"
          />
          <FormCheckBoxItem
            span={6}
            tooltip="SSH Tunnel"
            name="ssh"
            label="SSH"
          />
        </Row>
        {isSsh && (
          <>
            <Divider orientation="left">{t('SSH Tunnel')}</Divider>
            <Row gutter={20}>
              <FormInputItem span={12} name="ssh_host" label="Host" required />
              <FormInputNumberItem
                span={12}
                name="ssh_port"
                label="Port"
                inputProps={{
                  min: 0
                }}
                required
              />
            </Row>
            <Row gutter={20}>
              <FormInputItem
                span={12}
                required
                name="ssh_username"
                label="Username"
                rules={[
                  {
                    max: 255
                  }
                ]}
              />
              <FormInputPasswordItem
                span={12}
                dependencies={['ssh_private_key']}
                name="ssh_password"
                label="Password"
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
              />
            </Row>
            <Row gutter={20}>
              <FormInputItem
                span={12}
                name="ssh_private_key"
                label="Private Key"
                inputProps={{
                  onClick() {
                    open({ multiple: false }).then((r) => {
                      form.setFieldValue('ssh_private_key', r)
                    })
                  },
                  readOnly: true
                }}
              />
              <FormInputPasswordItem
                span={12}
                name="ssh_passphrase"
                label="Passphrase"
              />
            </Row>
          </>
        )}
      </Form>
    </Modal>
  )
}
export default observer(ConnectionForm)
