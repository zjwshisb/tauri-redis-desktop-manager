import { type DB } from '@/store/db'
import request from '@/utils/request'
import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, Select, Tooltip, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CusModal from '@/components/CusModal'
import useKeyTypes from '@/hooks/useKeyTypes'

const Plus: React.FC<{
  onSuccess: (name: string) => void
  db: DB
}> = (props) => {
  const { t } = useTranslation()

  const [form] = useForm()

  const keyTypes = useKeyTypes()

  return (
    <CusModal
      trigger={
        <Tooltip title={t('New Key')}>
          <PlusOutlined className="hover:cursor-pointer text-lg"></PlusOutlined>
        </Tooltip>
      }
      title={t('New Key')}
      onOk={async () => {
        await form.validateFields().then(async (res) => {
          await request('key/add', props.db.connection.id, {
            ...res,
            db: props.db?.db
          }).then(() => {
            props.onSuccess(res.name)
            message.success(t('Success'))
          })
        })
      }}
      onCancel={() => {
        form.resetFields()
      }}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          types: 'string'
        }}
      >
        <Form.Item
          name="name"
          label={t('Key Name')}
          rules={[{ required: true }]}
        >
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
      </Form>
    </CusModal>
  )
}
export default Plus
