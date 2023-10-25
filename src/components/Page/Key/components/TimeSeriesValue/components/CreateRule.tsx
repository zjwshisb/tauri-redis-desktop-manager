import React from 'react'

import { Button, Form, Input, InputNumber, Select } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const CreateRule: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      documentUrl="https://redis.io/commands/ts.createrule/"
      defaultValue={{
        source_key: keys.name
      }}
      title={'TS.CREATERULE'}
      width={400}
      trigger={<Button type="primary">CREATERULE</Button>}
      onSubmit={async (v) => {
        await request('timeseries/create-rule', keys.connection_id, {
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
        tooltip="is key name for destination (compacted) time series. It must be created before TS.CREATERULE is called."
      >
        <Input placeholder={t('Please Enter').toString()}></Input>
      </Form.Item>
      <Form.Item
        tooltip="aggregates results into time buckets"
        name="aggregation"
        label="AGGREGATION"
        rules={[{ required: true }]}
      >
        <Select
          placeholder={t('Please Select').toString()}
          options={[
            'avg',
            'sum',
            'min',
            'max',
            'range',
            'count',
            'first',
            'last',
            'std.p',
            'std.s',
            'var.p',
            'var.s',
            'twa'
          ].map((v) => {
            return {
              value: v,
              label: v
            }
          })}
        ></Select>
      </Form.Item>
      <Form.Item
        tooltip="bucketDuration is duration of each bucket, in milliseconds."
        name={'bucket_duration'}
        label="bucketDuration"
        rules={[{ required: true }]}
      >
        <InputNumber
          min={0}
          className="!w-full"
          placeholder={t('Please Enter').toString()}
        />
      </Form.Item>
      <Form.Item
        name={'align_timestamp'}
        label="alignTimestamp"
        tooltip="ensures that there is a bucket that starts exactly at alignTimestamp and aligns all other buckets accordingly. It is expressed in milliseconds. The default value is 0: aligned with the Unix epoch."
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
export default CreateRule
