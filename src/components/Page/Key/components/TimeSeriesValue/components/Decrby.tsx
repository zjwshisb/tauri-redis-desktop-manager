import React from 'react'

import { Button, Form, InputNumber } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const Decrby: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      title={'TS.DECRBY'}
      width={400}
      documentUrl="https://redis.io/commands/ts.decrby/"
      trigger={<Button type="primary">TS.DECRBY</Button>}
      onSubmit={async (v) => {
        await request('timeseries/decrby', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <Form.Item
        name="field"
        label="Value"
        rules={[{ required: true }]}
        tooltip="is numeric value of the subtrahend (double)."
      >
        <InputNumber
          stringMode
          className="!w-full"
          placeholder={t('Please Enter').toString()}
        ></InputNumber>
      </Form.Item>
      <Form.Item
        name="value"
        label="Timestamp"
        tooltip="is Unix time (integer, in milliseconds) specifying the sample timestamp or * to set the sample timestamp to the Unix time of the server's clock."
      >
        <InputNumber
          min={0}
          className="!w-full"
          placeholder={t('Please Enter').toString()}
        />
      </Form.Item>
    </ModalForm>
  )
}
export default Decrby
