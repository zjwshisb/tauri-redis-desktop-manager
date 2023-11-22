import FormCheckBoxItem from '@/components/Form/FormCheckBoxItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import { Row } from 'antd'
import React from 'react'

const BloomFilterItem: React.FC = () => {
  return (
    <>
      <Row gutter={20}>
        <FormInputNumberItem
          span={8}
          inputProps={{
            max: 1,
            min: 0,
            stringMode: true
          }}
          name="error_rate"
          required
          label="Error Rate"
          tooltip={
            'The desired probability for false positives. The rate is a decimal value between 0 and 1. For example, for a desired false positive rate of 0.1% (1 in 1000), error_rate should be set to 0.001.'
          }
        />

        <FormInputNumberItem
          span={8}
          name="capacity"
          label="Capacity"
          required
          inputProps={{
            min: 1,
            max: 99999999
          }}
          tooltip="The number of entries intended to be added to the filter. If your filter allows scaling, performance will begin to degrade after adding more items than this number. The actual degradation depends on how far the limit has been exceeded. Performance degrades linearly with the number of sub-filters."
        />
      </Row>
      <Row gutter={20}>
        <FormInputNumberItem
          span={8}
          name="expansion"
          label="Expansion"
          inputProps={{
            min: 1,
            max: 99999999
          }}
          tooltip="When capacity is reached, an additional sub-filter is created. The size of the new sub-filter is the size of the last sub-filter multiplied by expansion, specified as a positive integer."
        />

        <FormCheckBoxItem
          span={8}
          name="Nonscaling"
          label={'NONSCALING'}
          tooltip="Prevents the filter from creating additional sub-filters if initial capacity is reached. Non-scaling filters requires slightly less memory than their scaling counterparts. The filter returns an error when capacity is reached."
        />
      </Row>
    </>
  )
}
export default BloomFilterItem
