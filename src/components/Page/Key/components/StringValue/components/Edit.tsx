import React from 'react'
import { Button, Form, Input, InputNumber, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import request from '@/utils/request'
import CusModal from '@/components/CusModal'
import { useForm } from 'antd/es/form/Form'

const BinaryEdit: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  const [form] = useForm()

  return (
    <CusModal
      title={t('Edit')}
      onClear={() => {
        form.resetFields()
      }}
      onOk={async () => {
        return await form.validateFields().then(async (r) => {
          return await request('key/setbit', keys.connection_id, {
            name: keys.name,
            db: keys.db,
            ...r
          }).then(() => {
            onSuccess()
            return true
          })
        })
      }}
      trigger={<Button type="primary">{t('Edit')}</Button>}
    >
      <Form
        form={form}
        initialValues={{
          value: 1
        }}
      >
        <Form.Item name={'offset'} label="offset" rules={[{ required: true }]}>
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item name={'value'} label="value" rules={[{ required: true }]}>
          <Select
            options={[
              {
                label: 1,
                value: 1
              },
              {
                label: 0,
                value: 0
              }
            ]}
          ></Select>
        </Form.Item>
      </Form>
    </CusModal>
  )
}

const NormalEdit: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const [value, setValue] = React.useState(keys.data)

  React.useEffect(() => {
    setValue(keys.data)
  }, [keys.data])

  const { t } = useTranslation()

  return (
    <CusModal
      title={t('Edit')}
      onOk={async () => {
        return await request('key/set', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          value
        }).then(() => {
          onSuccess()
          return true
        })
      }}
      trigger={<Button type="primary">{t('Edit')}</Button>}
    >
      <Input.TextArea
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
      ></Input.TextArea>
    </CusModal>
  )
}

const Edit: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = (props) => {
  if (props.keys.extra_type === 'Binary') {
    return <BinaryEdit {...props}></BinaryEdit>
  }
  return <NormalEdit {...props}></NormalEdit>
}

export default Edit
