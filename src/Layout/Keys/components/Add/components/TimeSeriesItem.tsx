import React from 'react'

import { Row } from 'antd'
import FormListItem from '@/components/Form/FormListItem'

import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormSelectItem from '@/components/Form/FormSelectItem'
import FormInputItem from '@/components/Form/FormInputItem'

const TimeSeriesItem: React.FC<{
  type: 'alter' | 'create'
}> = ({ type }) => {
  return (
    <>
      <FormInputNumberItem
        inputProps={{ min: 0 }}
        name="rentention"
        label="RETENTION(retentionPeriod)"
        tooltip="is maximum age for samples compared to the highest reported timestamp, in milliseconds. Samples are expired based
        solely on the difference between their timestamp and the timestamps passed to subsequent TS.ADD, TS.MADD, TS.INCRBY, and
        TS.DECRBY calls with this key.When set to 0, samples never expire. When not specified, the option is set to the global
        RETENTION_POLICY configuration of the database, which by default is 0."
      />

      {type === 'create' && (
        <FormSelectItem
          name="encoding"
          label="ENCODING"
          inputProps={{
            options: [
              { label: 'COMPRESSED', value: 'COMPRESSED' },
              { label: 'UNCOMPRESSED', value: 'UNCOMPRESSED' }
            ]
          }}
          tooltip="COMPRESSED is almost always the right choice. Compression not only saves memory but usually improves performance due to a lower number of memory accesses. It can result in about 90% memory reduction. The exception are highly irregular timestamps or values, which occur rarely."
        />
      )}
      <FormInputItem
        name="size"
        label="CHUNK_SIZE(size)"
        inputProps={{ min: 0 }}
        tooltip="is initial allocation size, in bytes, for the data part of each new chunk. Actual chunks may consume more memory. Changing chunkSize (using TS.ALTER) does not affect existing chunks."
      />
      <FormSelectItem
        name="policy"
        label="DUPLICATE_POLICY(policy)"
        tooltip="is policy for handling insertion (TS.ADD and TS.MADD) of multiple samples with identical timestamps"
        inputProps={{
          options: [
            { label: 'BLOCK', value: 'block' },
            { label: 'FIRST', value: 'first' },
            { label: 'LAST', value: 'last' },
            { label: 'MIN', value: 'min' },
            { label: 'MAX', value: 'max' },
            { label: 'SUM', value: 'sum' }
          ]
        }}
      />
      <FormListItem
        name="labels"
        label="LABELS"
        tooltip="is set of label-value pairs that represent metadata labels of the key and serve as a secondary index."
        canBeZero
        renderItem={({ key, name, ...restField }) => {
          return (
            <Row key={key} gutter={20}>
              <FormInputItem
                span={12}
                {...restField}
                name={[name, 'field']}
                label="Field"
                required
              />
              <FormInputItem
                span={12}
                {...restField}
                name={[name, 'value']}
                label="Value"
                required
              />
            </Row>
          )
        }}
      ></FormListItem>
    </>
  )
}
export default TimeSeriesItem
