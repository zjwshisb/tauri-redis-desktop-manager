import CusInputNumber from '@/components/CusInputNumber'
import { Col, Form, Row } from 'antd'
import React from 'react'

const TopKItem: React.FC = () => {
  return (
    <>
      <Form.Item
        name="top_k"
        label={'TopK'}
        tooltip={'Number of top occurring items to keep.'}
        rules={[{ required: true }]}
      >
        <CusInputNumber min={1} max={99999999} />
      </Form.Item>
      <Row>
        <Col span={8}>
          <Form.Item
            name="width"
            label={'width'}
            tooltip="Number of counters kept in each array. (Default 8)"
          >
            <CusInputNumber min={1} max={99999999} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="depth"
            label={'depth'}
            tooltip="Number of arrays. (Default 7)"
          >
            <CusInputNumber min={1} max={99999999} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="decay"
            label={'decay'}
            tooltip="The probability of reducing a counter in an occupied bucket. It is raised to power of it's counter (decay ^ bucket[i].counter). Therefore, as the counter gets higher, the chance of a reduction is being reduced. (Default 0.9)"
          >
            <CusInputNumber min={0.001} max={99999999} precision={3} />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}
export default TopKItem
