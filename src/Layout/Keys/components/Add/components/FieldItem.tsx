import { Row } from 'antd'
import React from 'react'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'

const FieldItem: React.FC = () => {
  return (
    <FormListItem
      name="value"
      renderItem={({ name, ...restField }) => {
        return (
          <Row gutter={20}>
            <FormInputItem
              span={12}
              {...restField}
              name={[name, 'field']}
              label="Field"
              required
            />
            <FormInputJsonItem
              span={12}
              {...restField}
              label="Value"
              name={[name, 'value']}
              required
            />
          </Row>
        )
      }}
    ></FormListItem>
  )
}
export default FieldItem
