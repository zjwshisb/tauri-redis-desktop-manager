import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const Expire: React.FC<{
  keys: APP.Key
  trigger: React.ReactElement
  onSuccess: (ttl: number) => void
}> = (props) => {
  return (
    <ModalForm
      width={400}
      onSubmit={async (v) => {
        await request<number>('key/expire', props.keys.connection_id, {
          name: props.keys.name,
          ttl: v.ttl,
          db: props.keys.db
        }).then(() => {
          props.onSuccess(v.ttl)
        })
      }}
      title={'EXPIRE'}
      trigger={props.trigger}
      defaultValue={{
        ttl: props.keys.ttl
      }}
    >
      <FormInputNumberItem
        name="ttl"
        label="TTL"
        tooltip="-1 mean PERSIST the key"
        inputProps={{
          min: 1
        }}
      />
    </ModalForm>
  )
}
export default Expire
