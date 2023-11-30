import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormInputItem from '@/components/Form/FormInputItem'

const ZIncrBy: React.FC<{
  keys: APP.ZSetKey
  defaultValue?: Record<string, any>
  onSuccess: () => void
  trigger?: React.ReactElement
}> = (props) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/zincrby/"
      width={500}
      defaultValue={{
        name: props.keys.name,
        ...props.defaultValue
      }}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('zset/zincrby', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'ZINCRBY'}
    >
      <BaseKeyForm>
        <FormInputNumberItem
          label="Increment"
          name={'value'}
          required
          inputProps={{
            stringMode: true
          }}
        />
        <FormInputItem label="Member" name={'field'} required />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default ZIncrBy
