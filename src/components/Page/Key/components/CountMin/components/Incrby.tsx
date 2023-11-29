import { Row } from 'antd'
import React from 'react'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import ModalQueryForm from '@/components/ModalQueryForm'

const IncyBy: React.FC<{
  keys: APP.CountMinKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalQueryForm
      title={'CMS.INCRBY'}
      documentUrl="https://redis.io/commands/cms.incrby/"
      width={800}
      defaultValue={{
        name: props.keys.name,
        value: [
          {
            field: undefined,
            value: undefined
          }
        ]
      }}
      afterQueryClose={props.onSuccess}
      onQuery={async (v) => {
        const res = await request('cms/incrby', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        return res.data
      }}
    >
      <BaseKeyForm>
        <FormListItem
          name="value"
          required
          renderItem={(field) => {
            return (
              <Row gutter={20}>
                <FormInputItem
                  label="Item"
                  span={8}
                  name={[field.name, 'field']}
                  required
                />
                <FormInputNumberItem
                  label="Increment"
                  span={16}
                  name={[field.name, 'value']}
                  inputProps={{
                    stringMode: true
                  }}
                  required
                />
              </Row>
            )
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default IncyBy
