import { Form, Input, InputNumber } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import CusModal from '@/components/CusModal'

const Index: React.FC<{
  keys: APP.ZSetKey
  field?: APP.ZSetField
  onSuccess: () => void
  trigger: React.ReactElement
}> = (props) => {
  const [form] = useForm()

  const { t } = useTranslation()

  return (
    <CusModal
      onClear={() => {
        form.resetFields()
      }}
      onOpen={() => {
        if (props.field != null) {
          form.setFieldsValue({
            value: props.field.value,
            score: props.field.score
          })
        }
      }}
      trigger={props.trigger}
      onOk={async () => {
        await form.validateFields().then(async (formData) => {
          await request<number>('key/zset/zadd', props.keys.connection_id, {
            name: props.keys.name,
            db: props.keys.db,
            value: formData.value,
            score: parseFloat(formData.score)
          }).then(() => {
            props.onSuccess()
          })
        })
      }}
      title={'ZADD'}
    >
      <Form form={form} layout="vertical" initialValues={{}}>
        <Form.Item
          name={'value'}
          label={t('Value')}
          required
          rules={[{ required: true }]}
        >
          <Input
            readOnly={props.field != null}
            placeholder={t('Please Enter {{name}}', {
              name: t('Value')
            }).toString()}
          ></Input>
        </Form.Item>
        <Form.Item
          name={'score'}
          label={t('Score')}
          required
          rules={[{ required: true }]}
        >
          <InputNumber
            placeholder={t('Please Enter {{name}}', {
              name: t('Score')
            }).toString()}
          ></InputNumber>
        </Form.Item>
      </Form>
    </CusModal>
  )
}
export default Index
