import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'
import FormRadioItem from '@/components/Form/FormRadioItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import options from '../options'
import BaseKeyForm from '../../BaseKeyForm'

const LInsert: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)
  return (
    <VersionAccess connection={connection} version="2.2.0">
      <ModalForm
        width={400}
        documentUrl="https://redis.io/commands/linsert/"
        defaultValue={{
          name: props.keys.name
        }}
        onSubmit={async (v) => {
          await request<number>('list/linsert', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'LINSERT'}
      >
        <BaseKeyForm>
          <FormInputItem name={'pivot'} label={'Pivot'} required />
          <FormRadioItem
            name={'whereto'}
            label={'Whereto'}
            required
            inputProps={{
              options
            }}
          />
          <FormInputJsonItem name={'value'} label={'Value'} required />
        </BaseKeyForm>
      </ModalForm>
    </VersionAccess>
  )
}
export default LInsert
