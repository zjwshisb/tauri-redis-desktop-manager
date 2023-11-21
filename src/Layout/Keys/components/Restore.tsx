import { type KeyInfo } from '@/store/key'
import request from '@/utils/request'
import { ImportOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Tooltip } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from 'antd/es/input/TextArea'
import VersionAccess from '@/components/VersionAccess'
import ModalForm from '@/components/ModalForm'
import CusInput from '@/components/CusInput'
import CusInputNumber from '@/components/CusInputNumber'

const Restore: React.FC<{
  onSuccess: (name: string) => void
  info: KeyInfo
}> = ({ info, onSuccess }) => {
  const { t } = useTranslation()
  return (
    <VersionAccess connection={info.connection} version="2.6.0">
      <ModalForm
        defaultValue={{
          ttl: 0
        }}
        trigger={
          <Tooltip title={t('Restore Key')} placement="bottom">
            <Button
              type="text"
              size="small"
              icon={<ImportOutlined className="text-lg"></ImportOutlined>}
            ></Button>
          </Tooltip>
        }
        title={t('Restore Key')}
        onSubmit={async (v) => {
          await request('key/restore', info.connection.id, {
            ...v,
            db: info?.db
          }).then(() => {
            onSuccess(v.name)
          })
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
          <CusInput />
        </Form.Item>
        <Form.Item
          name="ttl"
          label={t('TTL')}
          rules={[{ required: true }]}
          tooltip={t(
            'If ttl is 0 the key is created without any expire, otherwise the specified expire time (in milliseconds) is set.'
          )}
        >
          <CusInputNumber min={0} max={100000000000} />
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
          <TextArea placeholder={t('Please Enter').toString()}></TextArea>
        </Form.Item>
      </ModalForm>
    </VersionAccess>
  )
}
export default Restore
