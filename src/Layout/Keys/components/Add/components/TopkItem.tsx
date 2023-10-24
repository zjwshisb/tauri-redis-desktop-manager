import { Col, Form, InputNumber, Row } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TopK: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Form.Item
        name="top_k"
        label={'TopK'}
        tooltip={'Number of top occurring items to keep.'}
        rules={[{ required: true }]}
      >
        <InputNumber
          min={1}
          max={99999999}
          placeholder={t('Please Enter').toString()}
        />
      </Form.Item>
      <Row>
        <Col span={8}>
          <Form.Item
            name="width"
            label={'width'}
            tooltip="Number of counters kept in each array. (Default 8)"
          >
            <InputNumber
              min={1}
              max={99999999}
              placeholder={t('Please Enter').toString()}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="depth"
            label={'depth'}
            tooltip="Number of arrays. (Default 7)"
          >
            <InputNumber
              min={1}
              max={99999999}
              placeholder={t('Please Enter').toString()}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="decay"
            label={'decay'}
            tooltip="The probability of reducing a counter in an occupied bucket. It is raised to power of it's counter (decay ^ bucket[i].counter). Therefore, as the counter gets higher, the chance of a reduction is being reduced. (Default 0.9)"
          >
            <InputNumber
              min={0.001}
              max={99999999}
              precision={3}
              placeholder={t('Please Enter').toString()}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}
export default TopK
