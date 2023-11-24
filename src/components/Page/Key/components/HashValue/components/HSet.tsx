import { Row } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const HSet: React.FC<{
  keys: APP.HashKey
  trigger?: React.ReactElement
  defaultValue?: Record<string, any>
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      title={'HSET'}
      documentUrl="https://redis.io/commands/hset/"
      width={800}
      defaultValue={{
        name: props.keys.name,
        ...props.defaultValue
      }}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('hash/hset', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        }).then(() => {
          props.onSuccess()
        })
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
                  label="Field"
                  span={8}
                  name={[field.name, 'field']}
                  required
                />
                <FormInputJsonItem
                  label="Value"
                  span={16}
                  name={[field.name, 'value']}
                  required
                />
              </Row>
            )
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default HSet
