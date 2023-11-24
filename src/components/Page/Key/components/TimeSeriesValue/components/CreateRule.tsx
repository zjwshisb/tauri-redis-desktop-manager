import React from 'react'

import { Button } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormInputItem from '@/components/Form/FormInputItem'
import FormSelectItem from '@/components/Form/FormSelectItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const CreateRule: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
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
      <FormInputItem
        name="source_key"
        label="Source Key"
        required
        tooltip="is key name for the source time series."
      ></FormInputItem>

      <FormInputItem
        name="dest_key"
        label="Dest Key"
        required
        tooltip="is key name for destination (compacted) time series. It must be created before TS.CREATERULE is called."
      ></FormInputItem>
      <FormSelectItem
        tooltip="aggregates results into time buckets"
        name="aggregation"
        label="Aggregation"
        required
        inputProps={{
          options: [
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
          })
        }}
      />
      <FormInputNumberItem
        tooltip="bucketDuration is duration of each bucket, in milliseconds."
        name={'bucket_duration'}
        label="Bucket Duration"
        required
        inputProps={{
          min: 0
        }}
      />
      <FormInputNumberItem
        name={'align_timestamp'}
        label="Align Timestamp"
        tooltip="ensures that there is a bucket that starts exactly at alignTimestamp and aligns all other buckets accordingly. It is expressed in milliseconds. The default value is 0: aligned with the Unix epoch."
        inputProps={{
          min: 0
        }}
      />
    </ModalForm>
  )
}
export default CreateRule
