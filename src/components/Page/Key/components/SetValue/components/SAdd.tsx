import { Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'

const SAdd: React.FC<{
  keys: APP.SetKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/sadd/"
      defaultValue={{
        value: [undefined],
        name: props.keys.name
      }}
      trigger={<Button type="primary">SADD</Button>}
      onSubmit={async (v) => {
        await request<number>('set/sadd', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'SADD'}
    >
      <FormInputItem name={'name'} label="Key" required />
      <FormListItem
        label="Items"
        required
        name="value"
        renderItem={(field) => {
          return <FormInputJsonItem {...field} required />
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default SAdd
