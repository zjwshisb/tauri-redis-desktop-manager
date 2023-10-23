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
      title={'TS.ADD'}
      width={400}
      trigger={<Button type="primary">TS.ADD</Button>}
      onSubmit={async (v) => {
        await request('timeseries/add', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <Form.Item name="field" label="Value" rules={[{ required: true }]}>
        <InputNumber stringMode className="!w-full"></InputNumber>
      </Form.Item>
      <Form.Item name="value" label="Timestamp" rules={[{ required: true }]}>
        <InputNumber min={0} className="!w-full" />
      </Form.Item>
    </ModalForm>
  )
}
export default TimeSeriesValue
