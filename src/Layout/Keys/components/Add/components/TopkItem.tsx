import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import { Row } from 'antd'
import React from 'react'

const TopKItem: React.FC = () => {
  return (
    <>
      <FormInputNumberItem
        name="top_k"
        label={'TopK'}
        tooltip={'Number of top occurring items to keep.'}
        required
        inputProps={{
          min: 1
        }}
      />

      <Row gutter={20}>
        <FormInputNumberItem
          span={8}
          name="width"
          label="width"
          tooltip="Number of counters kept in each array. (Default 8)"
          inputProps={{
            min: 1
          }}
        />
        <FormInputNumberItem
          span={8}
          name="depth"
          label={'depth'}
          tooltip="Number of arrays. (Default 7)"
          inputProps={{
            min: 1
          }}
        />
        <FormInputNumberItem
          span={8}
          name="decay"
          label={'decay'}
          tooltip="The probability of reducing a counter in an occupied bucket. It is raised to power of it's counter (decay ^ bucket[i].counter). Therefore, as the counter gets higher, the chance of a reduction is being reduced. (Default 0.9)"
          inputProps={{
            min: 0.001
          }}
        />
      </Row>
    </>
  )
}
export default TopKItem
