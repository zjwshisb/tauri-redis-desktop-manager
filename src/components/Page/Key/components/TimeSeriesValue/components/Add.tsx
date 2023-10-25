import React from 'react'

import { Button, Form, InputNumber } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const Add: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      title={'TS.ADD'}
      width={400}
      documentUrl="https://redis.io/commands/ts.add/"
      trigger={<Button type="primary">ADD</Button>}
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
      <Form.Item
        name="field"
        label="Value"
        rules={[{ required: true }]}
        tooltip="is (double) numeric data value of the sample. The double number should follow RFC 7159 (JSON standard). In particular, the parser rejects overly large values that do not fit in binary64. It does not accept NaN or infinite values."
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
        rules={[{ required: true }]}
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
export default Add
