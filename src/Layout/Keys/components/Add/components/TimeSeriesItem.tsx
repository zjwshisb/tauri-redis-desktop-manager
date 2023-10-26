import React from 'react'

import { Form, InputNumber, Row, Col, Input, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import FormListItem from '@/components/FormListItem'

const TimeSeriesItem: React.FC<{
  type: 'alter' | 'create'
}> = ({ type }) => {
  const { t } = useTranslation()

  return (
    <>
      <Form.Item
        name="rentention"
        label="RETENTION(retentionPeriod)"
        tooltip="is maximum age for samples compared to the highest reported timestamp, in milliseconds. Samples are expired based
        solely on the difference between their timestamp and the timestamps passed to subsequent TS.ADD, TS.MADD, TS.INCRBY, and
        TS.DECRBY calls with this key.When set to 0, samples never expire. When not specified, the option is set to the global
        RETENTION_POLICY configuration of the database, which by default is 0."
      >
        <InputNumber
          min={0}
          className="!w-full"
          placeholder={t('Please Select').toString()}
        ></InputNumber>
      </Form.Item>
      {type === 'create' && (
        <Form.Item
          name="encoding"
          label="ENCODING"
          tooltip="COMPRESSED is almost always the right choice. Compression not only saves memory but usually improves performance due to a lower number of memory accesses. It can result in about 90% memory reduction. The exception are highly irregular timestamps or values, which occur rarely."
        >
          <Select
            placeholder={t('Please Select').toString()}
            options={[
              { label: 'COMPRESSED', value: 'COMPRESSED' },
              { label: 'UNCOMPRESSED', value: 'UNCOMPRESSED' }
            ]}
          />
        </Form.Item>
      )}

      <Form.Item
        name="size"
        label="CHUNK_SIZE(size)"
        tooltip="is initial allocation size, in bytes, for the data part of each new chunk. Actual chunks may consume more memory. Changing chunkSize (using TS.ALTER) does not affect existing chunks."
      >
        <InputNumber
          min={0}
          className="!w-full"
          placeholder={t('Please Enter').toString()}
        />
      </Form.Item>
      <Form.Item
        name="policy"
        label="DUPLICATE_POLICY(policy)"
        tooltip="is policy for handling insertion (TS.ADD and TS.MADD) of multiple samples with identical timestamps"
      >
        <Select
          placeholder={t('Please Select')}
          options={[
            { label: 'BLOCK', value: 'block' },
            { label: 'FIRST', value: 'first' },
            { label: 'LAST', value: 'last' },
            { label: 'MIN', value: 'min' },
            { label: 'MAX', value: 'max' },
            { label: 'SUM', value: 'sum' }
          ]}
        />
      </Form.Item>
      <FormListItem
        name="labels"
        itemProps={{
          label: 'LABELS',
          tooltip:
            'is set of label-value pairs that represent metadata labels of the key and serve as a secondary index.'
        }}
        canBeZero
        renderItem={({ key, name, ...restField }) => {
          return (
            <Row key={key} gutter={20}>
              <Col span={12}>
                <Form.Item
                  {...restField}
                  name={[name, 'field']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder={t('Please Enter').toString()} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...restField}
                  name={[name, 'value']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder={t('Please Enter').toString()} />
                </Form.Item>
              </Col>
            </Row>
          )
        }}
      ></FormListItem>
    </>
  )
}
export default TimeSeriesItem
