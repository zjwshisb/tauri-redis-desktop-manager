import { type KeyInfo } from '@/store/key'
import request from '@/utils/request'
import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, Select, Tooltip } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useKeyTypes from '@/hooks/useKeyTypes'
import ModalForm from '@/components/ModalForm'

const Plus: React.FC<{
  onSuccess: (name: string) => void
  info: KeyInfo
}> = (props) => {
  const { t } = useTranslation()

  const keyTypes = useKeyTypes()

  return (
    <ModalForm
      defaultValue={{
        types: 'string'
      }}
      trigger={
        <Tooltip title={t('New Key')} placement="bottom">
          <PlusOutlined className="hover:cursor-pointer text-lg"></PlusOutlined>
        </Tooltip>
      }
      title={t('New Key')}
      onSubmit={async (v) => {
        await request('key/add', props.info.connection.id, {
          db: props.info?.db,
          ...v
        })
        props.onSuccess(v.name)
      }}
    >
      <Form.Item name="name" label={t('Key Name')} rules={[{ required: true }]}>
        <Input
          placeholder={t('Please Enter {{name}}', {
            name: t('Key Name')
          }).toString()}
        ></Input>
      </Form.Item>
      <Form.Item
        name="types"
        label={t('Key Type')}
        rules={[{ required: true }]}
      >
        <Select options={keyTypes}></Select>
      </Form.Item>
    </ModalForm>
  )
}
export default Plus
