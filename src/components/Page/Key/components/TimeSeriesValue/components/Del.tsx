import React from 'react'

import { Button, Form, InputNumber } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'

const TimeSeriesValue: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      title={'TS.DEL'}
      width={400}
      trigger={
        <Button type="primary" danger>
          TS.DEL
        </Button>
      }
      onSubmit={async (v) => {
        await request('timeseries/del', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <Form.Item
        name="start"
        label="Form Timestamp"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} className="!w-[300px]" />
      </Form.Item>
      <Form.Item name="stop" label="To Timestamp" rules={[{ required: true }]}>
        <InputNumber min={0} className="!w-[300px]" />
      </Form.Item>
    </ModalForm>
  )
}
export default TimeSeriesValue
