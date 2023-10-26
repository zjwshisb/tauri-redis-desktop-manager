import { Checkbox, Col, Form, InputNumber, Row } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

const BloomFilterItem: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Row>
        <Col span={8}>
          <Form.Item
            name="error_rate"
            label={'Error Rate'}
            tooltip={
              'The desired probability for false positives. The rate is a decimal value between 0 and 1. For example, for a desired false positive rate of 0.1% (1 in 1000), error_rate should be set to 0.001.'
            }
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              max={1}
              stringMode
              placeholder={t('Please Enter').toString()}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="capacity"
            label={'Capacity'}
            rules={[{ required: true }]}
            tooltip="The number of entries intended to be added to the filter. If your filter allows scaling, performance will begin to degrade after adding more items than this number. The actual degradation depends on how far the limit has been exceeded. Performance degrades linearly with the number of sub-filters."
          >
            <InputNumber
              min={1}
              max={99999999}
              placeholder={t('Please Enter').toString()}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={8}>
          <Form.Item
            name="expansion"
            label={'Expansion'}
            tooltip="When capacity is reached, an additional sub-filter is created. The size of the new sub-filter is the size of the last sub-filter multiplied by expansion, specified as a positive integer."
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
            name="Nonscaling"
            label={'NONSCALING'}
            tooltip="Prevents the filter from creating additional sub-filters if initial capacity is reached. Non-scaling filters requires slightly less memory than their scaling counterparts. The filter returns an error when capacity is reached."
          >
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}
export default BloomFilterItem
