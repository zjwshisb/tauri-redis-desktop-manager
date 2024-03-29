import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormListItem from '@/components/Form/FormListItem'

const ZRem: React.FC<{
  keys: APP.ZSetKey
  defaultValue: Record<string, any>
  onSuccess: () => void
  trigger?: React.ReactElement
}> = (props) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/zrem/"
      defaultValue={{
        name: props.keys.name,
        ...props.defaultValue
      }}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('zset/zrem', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'ZREM'}
    >
      <BaseKeyForm>
        <FormListItem
          required
          label="Members"
          name={'value'}
          renderItem={(f) => {
            return <FormInputJsonItem {...f} required />
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default ZRem
