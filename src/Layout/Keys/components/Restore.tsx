import { type KeyInfo } from '@/store/key'
import request from '@/utils/request'
import { ImportOutlined } from '@ant-design/icons'
import { Checkbox, Form, Input, InputNumber, Tooltip } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CusModal from '@/components/CusModal'
import TextArea from 'antd/es/input/TextArea'
import VersionAccess from '@/components/VersionAccess'

const Import: React.FC<{
  onSuccess: (name: string) => void
  info: KeyInfo
}> = ({ info, onSuccess }) => {
  const { t } = useTranslation()

  const [form] = useForm()

  return (
    <VersionAccess connection={info.connection} version="2.6.0">
      <CusModal
        trigger={
          <Tooltip title={t('Restore Key')} placement="bottom">
            <ImportOutlined className="hover:cursor-pointer text-lg"></ImportOutlined>
          </Tooltip>
        }
        title={t('Restore Key')}
        onOk={async () => {
          await form.validateFields().then(async (res) => {
            await request('key/restore', info.connection.id, {
              ...res,
              db: info?.db
            }).then(() => {
              onSuccess(res.name)
            })
          })
        }}
        onClear={() => {
          form.resetFields()
        }}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            ttl: 0
          }}
        >
          <Form.Item
            getValueFromEvent={(e) => {
              return e.target.value
            }}
            name="name"
            label={t('Key Name')}
            rules={[{ required: true }]}
          >
            <Input
              type="text"
              placeholder={t('Please Enter {{name}}', {
                name: t('Key Name')
              }).toString()}
            ></Input>
          </Form.Item>
          <Form.Item
            name="ttl"
            label={t('TTL')}
            rules={[{ required: true }]}
            tooltip={t(
              'If ttl is 0 the key is created without any expire, otherwise the specified expire time (in milliseconds) is set.'
            )}
          >
            <InputNumber min={0} max={100000000000}></InputNumber>
          </Form.Item>
          <VersionAccess connection={info.connection} version="3.0.0">
            <Form.Item
              valuePropName="checked"
              name={'replace'}
              label={t('Replace')}
              tooltip={t('Replace exists key')}
            >
              <Checkbox />
            </Form.Item>
          </VersionAccess>
          <Form.Item
            rules={[
              {
                required: true
              }
            ]}
            label={t('Serialized Value')}
            name={'value'}
            tooltip={t('The serialized-value created by dump command')}
          >
            <TextArea></TextArea>
          </Form.Item>
        </Form>
      </CusModal>
    </VersionAccess>
  )
}
export default Import
