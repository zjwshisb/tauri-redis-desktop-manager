import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const FieldForm: React.FC<{
  keys: APP.ZSetKey
  field?: APP.Field
  onSuccess: () => void
  trigger: React.ReactElement
}> = (props) => {
  return (
    <ModalForm
      defaultValue={props.field}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('key/zset/zadd', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          value: [
            {
              field: v.field,
              value: v.value.toString()
            }
          ]
        })
        props.onSuccess()
      }}
      title={'ZADD'}
    >
      <FormInputJsonItem
        name={'field'}
        label="Field"
        required
        inputProps={{
          readOnly: props.field != null
        }}
      />
      <FormInputNumberItem name="value" label="Score" required />
    </ModalForm>
  )
}
export default FieldForm
