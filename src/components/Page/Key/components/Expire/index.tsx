import { Form, InputNumber } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import CusModal from '@/components/CusModal'

const Index: React.FC<{
  keys: APP.Key
  trigger: React.ReactElement
  onSuccess: (ttl: number) => void
}> = (props) => {
  const [form] = useForm(undefined)

  return (
    <CusModal
      trigger={props.trigger}
      onOpen={() => {
        form.setFieldsValue({
          ttl: props.keys.ttl
        })
      }}
      onOk={async () => {
        const ttl: number = form.getFieldValue('ttl')
        await request<number>('key/expire', props.keys.connection_id, {
          name: props.keys.name,
          ttl,
          db: props.keys.db
        }).then(() => {
          props.onSuccess(ttl)
        })
      }}
      title={'EXPIRE'}
    >
      <Form form={form}>
        <Form.Item name={'ttl'} label={'TTL'}>
          <InputNumber min={0}></InputNumber>
        </Form.Item>
      </Form>
    </CusModal>
  )
}
export default Index
