import CusInputNumber from '@/components/CusInputNumber'
import { Col, Form, Row } from 'antd'
import React from 'react'

const CuckooFilterItem: React.FC = () => {
  return (
    <>
      <Form.Item
        name="capacity"
        label={'Capacity'}
        tooltip={
          "Estimated capacity for the filter. Capacity is rounded to the next 2^n number. The filter will likely not fill up to 100% of it's capacity. Make sure to reserve extra capacity if you want to avoid expansions."
        }
        rules={[{ required: true }]}
      >
        <CusInputNumber min={0} />
      </Form.Item>

      <Row>
        <Col span={8}>
          <Form.Item
            name="bucketsize"
            label={'Bucket Size'}
            tooltip="Number of items in each bucket. A higher bucket size value improves the fill rate but also causes a higher error rate and slightly slower performance. The default value is 2."
          >
            <CusInputNumber min={1} max={99999999} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="maxiterations"
            label={'Maxiterations'}
            tooltip="Number of attempts to swap items between buckets before declaring filter as full and creating an additional filter. A low value is better for performance and a higher number is better for filter fill rate. The default value is 20."
          >
            <CusInputNumber min={1} max={99999999} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="expansion"
            label={'Expansion'}
            tooltip="When a new filter is created, its size is the size of the current filter multiplied by expansion, specified as a non-negative integer. Expansion is rounded to the next 2^n number. The default value is 1."
          >
            <CusInputNumber min={1} max={99999999} />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}
export default CuckooFilterItem
