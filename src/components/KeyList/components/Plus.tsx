import { type DB } from '@/store/db'
import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, Modal, Select, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import { useTranslation } from 'react-i18next'

const options = [
  {
    label: 'String',
    value: 'string'
  },
  {
    label: 'List',
    value: 'list'
  },
  {
    label: 'Hash',
    value: 'hash'
  },
  {
    label: 'Set',
    value: 'set'
  },

  {
    label: 'Sorted Set',
    value: 'zset'
  }
]

const Plus: React.FC<{
  onSuccess: () => void
  db: DB | null
}> = (props) => {
  const [open, setOpen] = React.useState(false)

  const [loading, setLoading] = React.useState(false)

  const { t } = useTranslation()

  const [form] = useForm()

  return (
    <>
      <PlusOutlined
        className="hover:cursor-pointer text-lg"
        onClick={() => {
          setOpen(true)
        }}
      ></PlusOutlined>
      <Modal
        open={open}
        title={t('New Key')}
        okButtonProps={{
          loading
        }}
        onOk={() => {
          form
            .validateFields()
            .then((res) => {
              setLoading(true)
              message.success(t('Success'))
            })
            .finally(() => {
              setLoading(false)
            })
        }}
        onCancel={() => {
          form.resetFields()
          setOpen(false)
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
            <Select options={options}></Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default Plus
