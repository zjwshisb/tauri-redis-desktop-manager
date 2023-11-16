import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Checkbox, Col, Form, Input, InputNumber, Row } from 'antd'

const Lcs: React.FC<{
  keys: APP.StringKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="LCS"
      width={400}
      documentUrl="https://redis.io/commands/lcs/"
      trigger={<Button type="primary">LCS</Button>}
      defaultValue={{
        key1: keys.name
      }}
      onQuery={async (v) => {
        const res = await request(
          'string/lcs',
          keys.connection_id,
          {
            name: keys.name,
            db: keys.db,
            ...v
          },
          {
            showNotice: false
          }
        )
        return res.data
      }}
    >
      <Form.Item rules={[{ required: true }]} name={'key1'} label="key1">
        <Input className="!w-full"></Input>
      </Form.Item>
      <Form.Item rules={[{ required: true }]} name={'key2'} label="key2">
        <Input className="!w-full"></Input>
      </Form.Item>
      <Row>
        <Col span={8}>
          <Form.Item name={'len'} label="LEN" valuePropName="checked">
            <Checkbox></Checkbox>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'idx'} label="IDX" valuePropName="checked">
            <Checkbox></Checkbox>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name={'withmatchlen'}
            label="WITHMATCHLEN"
            valuePropName="checked"
          >
            <Checkbox></Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name={'minmatchlen'} label="MINMATCHLEN">
        <InputNumber min={1} precision={0}></InputNumber>
      </Form.Item>
    </ModalQueryForm>
  )
}
export default Lcs
