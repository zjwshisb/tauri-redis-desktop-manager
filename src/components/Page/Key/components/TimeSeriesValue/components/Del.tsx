import React from 'react'

import { Button, Form, InputNumber } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const Del: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      title={'TS.DEL'}
      documentUrl="https://redis.io/commands/ts.del/"
      width={400}
      trigger={<Button type="primary">DEL</Button>}
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
        <InputNumber
          min={0}
          className="!w-full"
          placeholder={t('Please Enter').toString()}
        />
      </Form.Item>
      <Form.Item name="end" label="To Timestamp" rules={[{ required: true }]}>
        <InputNumber
          min={0}
          className="!w-full"
          placeholder={t('Please Enter').toString()}
        />
      </Form.Item>
    </ModalForm>
  )
}
export default Del
