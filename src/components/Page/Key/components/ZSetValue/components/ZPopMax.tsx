import React from 'react'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import ModalQueryForm from '@/components/ModalQueryForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import BaseKeyForm from '../../BaseKeyForm'

const ZPopMax: React.FC<{
  keys: APP.ZSetKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="5.0.0">
      <ModalQueryForm
        defaultValue={{
          name: props.keys.name
        }}
        width={500}
        documentUrl="https://redis.io/commands/zpopmax/"
        afterQueryClose={props.onSuccess}
        onQuery={async (v) => {
          const res = await request<number>(
            'zset/zpopmax',
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
        title={'ZPOPMAX'}
      >
        <BaseKeyForm>
          <FormInputNumberItem
            label="Count"
            name="value"
            inputProps={{
              stringMode: true
            }}
          />
        </BaseKeyForm>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default ZPopMax
