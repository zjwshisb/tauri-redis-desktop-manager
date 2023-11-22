import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import connectionContext from '../../../context'
import VersionAccess from '@/components/VersionAccess'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const RPushX: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="2.2.0">
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/rpushx/"
        defaultValue={{
          name: props.keys.name,
          value: [undefined]
        }}
        onSubmit={async (v) => {
          await request<number>('list/rpushx', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'RPUSHX'}
      >
        <BaseKeyForm>
          <FormListItem
            name="value"
            label="Items"
            required
            renderItem={(f) => {
              return <FormInputJsonItem {...f} required />
            }}
          ></FormListItem>
        </BaseKeyForm>
      </ModalForm>
    </VersionAccess>
  )
}
export default RPushX
