import React from 'react'

import { Button, Form, InputNumber } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const Incrby: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      title={'TS.INCRBY'}
      width={400}
      documentUrl="https://redis.io/commands/ts.incrby/"
      trigger={<Button type="primary">INCRBY</Button>}
      onSubmit={async (v) => {
        await request('timeseries/incrby', keys.connection_id, {
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
        tooltip="is numeric value of the addend (double)."
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
export default Incrby
