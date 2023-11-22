import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormRadioItem from '@/components/Form/FormRadioItem'
import options from '../options'

const LMPop: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="7.0.0" connection={connection}>
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/lmpop/"
        defaultValue={{
          keys: [props.keys.name]
        }}
        onSubmit={async (v) => {
          await request<number>('list/lmpop', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'LMPOP'}
      >
        <FormInputNumberItem name={'numkeys'} label={'Numkeys'} required />
        <FormListItem
          label="Keys"
          name="keys"
          renderItem={(field) => {
            return <FormInputItem {...field} required />
          }}
        ></FormListItem>
        <FormRadioItem
          name={'wherefrom'}
          label={'Wherefrom'}
          inputProps={{
            options
          }}
        />
        <FormInputNumberItem
          name={'count'}
          label="Count"
          inputProps={{
            min: 0
          }}
        />
      </ModalForm>
    </VersionAccess>
  )
}
export default LMPop
