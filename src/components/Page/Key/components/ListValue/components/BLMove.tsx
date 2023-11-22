import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'
import FormRadioItem from '@/components/Form/FormRadioItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import options from '../options'

const BLMove: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="6.2.0" connection={connection}>
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/blmove/"
        defaultValue={{
          source: props.keys.name
        }}
        onSubmit={async (v) => {
          await request<number>('list/blmove', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'BLMOVE'}
      >
        <FormInputItem name={'source'} label={'Source'} required />
        <FormInputItem name={'destination'} label={'Destination'} required />
        <FormRadioItem
          inputProps={{
            options
          }}
          name={'wherefrom'}
          label={'Wherefrom'}
          required
        ></FormRadioItem>

        <FormRadioItem
          name={'whereto'}
          label={'Whereto'}
          required
          inputProps={{
            options
          }}
        ></FormRadioItem>
        <FormInputNumberItem
          inputProps={{ min: 0 }}
          name={'timeout'}
          required
          label="Timeout"
        />
      </ModalForm>
    </VersionAccess>
  )
}
export default BLMove
