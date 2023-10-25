import React from 'react'

import { Button, Form, Input } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const DeleteRule: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      documentUrl="https://redis.io/commands/ts.deleterule/"
      defaultValue={{
        source_key: keys.name
      }}
      title={'TS.CREATERULE'}
      width={400}
      trigger={<Button type="primary">DELETERULE</Button>}
      onSubmit={async (v) => {
        await request('timeseries/delete-rule', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <Form.Item
        name="source_key"
        label="sourceKey"
        rules={[{ required: true }]}
        tooltip="is key name for the source time series."
      >
        <Input placeholder={t('Please Enter').toString()}></Input>
      </Form.Item>
      <Form.Item
        name="dest_key"
        label="destKey"
        rules={[{ required: true }]}
        tooltip="is key name for destination (compacted) time series."
      >
        <Input placeholder={t('Please Enter').toString()}></Input>
      </Form.Item>
    </ModalForm>
  )
}
export default DeleteRule
