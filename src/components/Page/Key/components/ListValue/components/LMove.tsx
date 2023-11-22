import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'
import FormRadioItem from '@/components/Form/FormRadioItem'
import options from '../options'

const LMove: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="6.2.0" connection={connection}>
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/lmove/"
        defaultValue={{
          source: props.keys.name
        }}
        onSubmit={async (v) => {
          await request<number>('list/lmove', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'LMOVE'}
      >
        <FormInputItem name={'source'} label={'Source'} required />
        <FormInputItem name={'destination'} label={'Destination'} required />
        <FormRadioItem
          name={'wherefrom'}
          label={'Wherefrom'}
          required
          inputProps={{
            options
          }}
        />
        <FormRadioItem
          name={'whereto'}
          label={'Whereto'}
          required
          inputProps={{
            options
          }}
        />
      </ModalForm>
    </VersionAccess>
  )
}
export default LMove
