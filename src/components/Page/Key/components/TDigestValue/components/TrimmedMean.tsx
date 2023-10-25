import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Col, Form, InputNumber, Row } from 'antd'

const TrimmedMean: React.FC<{
  keys: APP.TDigestKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="TDIGEST.TRIMMED_MEAN"
      width={500}
      documentUrl="https://redis.io/commands/tdigest.trimmed_mean/"
      trigger={<Button type="primary">TRIMMED_MEAN</Button>}
      onQuery={async (v) => {
        const res = await request<string>(
          'tdigest/trimmed-mean',
          keys.connection_id,
          {
            name: keys.name,
            db: keys.db,
            ...v
          }
        )
        return res.data
      }}
    >
      <Row>
        <Col span={12}>
          <Form.Item
            rules={[{ required: true }]}
            name={'low_cut_quantile'}
            label="low_cut_quantile"
            tooltip="Foating-point value in the range [0..1], should be lower than high_cut_quantile"
          >
            <InputNumber min={0} max={1} stringMode></InputNumber>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            rules={[{ required: true }]}
            name={'high_cut_quantile'}
            label="high_cut_quantile"
            tooltip="Floating-point value in the range [0..1], should be higher than low_cut_quantile"
          >
            <InputNumber min={0} max={1} stringMode></InputNumber>
          </Form.Item>
        </Col>
      </Row>
    </ModalQueryForm>
  )
}
export default TrimmedMean
