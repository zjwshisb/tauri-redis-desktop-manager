import { Row } from 'antd'
import React from 'react'
import FormListItem from '@/components/Form/FormListItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const ScoreItem: React.FC = () => {
  return (
    <FormListItem
      name="value"
      renderItem={({ name, ...restField }) => {
        return (
          <Row gutter={20}>
            <FormInputJsonItem
              span={12}
              {...restField}
              name={[name, 'field']}
              label="Member"
              required
            />
            <FormInputNumberItem
              span={12}
              {...restField}
              label="Score"
              name={[name, 'value']}
              required
              inputProps={{ stringMode: true }}
            />
          </Row>
        )
      }}
    ></FormListItem>
  )
}
export default ScoreItem
