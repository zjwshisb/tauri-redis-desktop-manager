import React from 'react'

import { Button, Form, InputNumber, Row, Col, Input, Select } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import Link from '@/components/Link'
import { type FormInstance } from 'antd/lib'
import lodash from 'lodash'

const TimeSeriesValue: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
  info: Array<APP.Field<string | number | APP.Field[] | APP.Field[][]>>
}> = ({ keys, onSuccess, info }) => {
  const form = React.useRef<FormInstance>(null)

  const defaultValue = React.useMemo(() => {
    let labels = lodash.cloneDeep(info.find((v) => v.field === 'labels')?.value)
    if (labels !== undefined) {
      labels = (labels as APP.Field[][]).map((v) => {
        return v[0]
      })
    }
    return {
      rentention: info.find((v) => v.field === 'retentionTime')?.value,
      size: info.find((v) => v.field === 'chunkSize')?.value,
      policy: info.find((v) => v.field === 'duplicatePolicy')?.value,
      labels
    }
  }, [info])

  React.useEffect(() => {
    console.log(defaultValue)
  }, [defaultValue])

  return (
    <ModalForm
      defaultValue={defaultValue}
      ref={form}
      title={'TS.ALTER'}
      width={400}
      trigger={<Button type="primary">TS.ALTER</Button>}
      onSubmit={async (v) => {
        await request('timeseries/alter', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <Link href="https://redis.io/commands/ts.create/" className="mb-2">
        https://redis.io/commands/ts.create/
      </Link>
      <Form.Item name="rentention" label="RETENTION(retentionPeriod)">
        <InputNumber min={0} className="!w-full"></InputNumber>
      </Form.Item>
      <Form.Item name="size" label="CHUNK_SIZE(size)">
        <InputNumber min={0} className="!w-full" />
      </Form.Item>
      <Form.Item name="policy" label="DUPLICATE_POLICY(policy)">
        <Select
          className="!w-full"
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

      <Form.List name="labels">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, ...restField }) => {
              console.log(key, name)
              return (
                <Row key={key} gutter={20}>
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'field']}
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(name)
                      }}
                    />
                  </Col>
                </Row>
              )
            })}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add()
                }}
                block
                icon={<PlusOutlined />}
              >
                Add Label
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
    </ModalForm>
  )
}
export default TimeSeriesValue
