import { Form, InputNumber } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'

const Expire: React.FC<{
  keys: APP.Key
  trigger: React.ReactElement
  onSuccess: (ttl: number) => void
}> = (props) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      width={400}
      onSubmit={async (v) => {
        await request<number>('key/expire', props.keys.connection_id, {
          name: props.keys.name,
          ttl: v.ttl,
          db: props.keys.db
        }).then(() => {
          props.onSuccess(v.ttl)
        })
      }}
      title={'EXPIRE'}
      trigger={props.trigger}
      defaultValue={{
        ttl: props.keys.ttl
      }}
    >
      <Form.Item
        name={'ttl'}
        label={'TTL'}
        tooltip={t('-1 mean PERSIST the key')}
      >
        <InputNumber min={-1} className="!w-full"></InputNumber>
      </Form.Item>
    </ModalForm>
  )
}
export default Expire
