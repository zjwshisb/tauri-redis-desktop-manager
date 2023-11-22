import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const BRPopLPush: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="6.2.0" type="less" connection={connection}>
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/brpoplpush/"
        defaultValue={{
          source: props.keys.name
        }}
        onSubmit={async (v) => {
          await request<number>('list/brpoplpush', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'BRPOPLPUSH'}
      >
        <FormInputItem name={'source'} label={'Source'} required />
        <FormInputItem name={'destination'} label={'Destination'} required />
        <FormInputNumberItem
          name={'timeout'}
          label="Timeout"
          required
          inputProps={{
            min: 0,
            precision: 0
          }}
        />
      </ModalForm>
    </VersionAccess>
  )
}
export default BRPopLPush
