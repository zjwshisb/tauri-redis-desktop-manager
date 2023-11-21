import { Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormListItem from '@/components/Form/FormListItem'

import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const BRPop: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="7.0.0" connection={connection}>
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/brpop/"
        defaultValue={{
          name: [props.keys.name]
        }}
        trigger={<Button type="primary">BRPOP</Button>}
        onSubmit={async (v) => {
          await request<number>('list/brpop', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'BRPOP'}
      >
        <FormListItem
          label="Keys"
          name="name"
          required
          renderItem={(field) => {
            return <FormInputItem {...field} required />
          }}
        ></FormListItem>
        <FormInputNumberItem
          name={'value'}
          label="Timeout"
          required
          inputProps={{ min: 0 }}
        />
      </ModalForm>
    </VersionAccess>
  )
}
export default BRPop
