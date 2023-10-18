import { Form, InputNumber } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import { EditOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import CusModal from '@/components/CusModal'
import IconButton from '@/components/IconButton'
import FieldInput from '@/components/FieldInput'

const Index: React.FC<{
  keys: APP.ListKey
  index: number
  value: string
  onSuccess: (value: string, index: number) => void
}> = (props) => {
  const [form] = useForm(undefined)

  const { t } = useTranslation()

  return (
    <>
      <CusModal
        trigger={<IconButton icon={<EditOutlined />} />}
        onOk={async () => {
          const formData = form.getFieldsValue()
          await request<number>('key/list/lset', props.keys.connection_id, {
            name: props.keys.name,
            db: props.keys.db,
            ...formData
          }).then(() => {
            props.onSuccess(formData.value, formData.index)
          })
        }}
        title={'LSET'}
        onClear={() => {
          form.resetFields()
        }}
        onOpen={() => {
          form.setFieldsValue({
            index: props.index,
            value: props.value
          })
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name={'index'} label={t('Index')}>
            <InputNumber readOnly></InputNumber>
          </Form.Item>
          <Form.Item name={'value'} label={t('Value')}>
            <FieldInput></FieldInput>
          </Form.Item>
        </Form>
      </CusModal>
    </>
  )
}
export default Index
