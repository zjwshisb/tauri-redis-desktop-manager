import React from 'react'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormListItem from '@/components/Form/FormListItem'
import ModalQueryForm from '@/components/ModalQueryForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'

const BZPopMax: React.FC<{
  keys: APP.ZSetKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="5.0.0">
      <ModalQueryForm
        defaultValue={{
          name: [props.keys.name]
        }}
        width={500}
        documentUrl="https://redis.io/commands/bzpopmax/"
        afterQueryClose={props.onSuccess}
        onQuery={async (v) => {
          const res = await request<number>(
            'zset/bzpopmax',
            props.keys.connection_id,
            {
              db: props.keys.db,
              ...v
            },
            {
              showNotice: false
            }
          )
          return res.data
        }}
        title={'BZPOPMAX'}
      >
        <FormInputNumberItem
          label="Timeout"
          name="value"
          required
          inputProps={{
            min: 0,
            stringMode: true
          }}
        />
        <FormListItem
          name="name"
          label="Keys"
          required
          renderItem={(field) => {
            return <FormInputItem {...field} required />
          }}
        ></FormListItem>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default BZPopMax
