import { Row } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'

const MSet: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      title={'MSET'}
      documentUrl="https://redis.io/commands/mset/"
      width={800}
      defaultValue={{
        value: [
          {
            field: keys.name,
            value: keys.data
          }
        ]
      }}
      onSubmit={async (v) => {
        await request<number>('string/mset', keys.connection_id, {
          db: keys.db,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <FormListItem
        name="value"
        renderItem={(field) => {
          return (
            <Row gutter={20}>
              <FormInputItem
                span={8}
                name={[field.name, 'field']}
                label="Name"
                required
              />
              <FormInputJsonItem
                span={16}
                name={[field.name, 'value']}
                label="Value"
                required
              />
            </Row>
          )
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default MSet
