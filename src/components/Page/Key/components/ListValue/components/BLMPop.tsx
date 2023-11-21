import { Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormListItem from '@/components/Form/FormListItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormInputItem from '@/components/Form/FormInputItem'
import FormRadioItem from '@/components/Form/FormRadioItem'

const BLMPop: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="7.0.0" connection={connection}>
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/blmpop/"
        defaultValue={{
          keys: [props.keys.name]
        }}
        trigger={<Button type="primary">BLMPOP</Button>}
        onSubmit={async (v) => {
          await request<number>('list/blmpop', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'BLMPOP'}
      >
        <FormInputNumberItem name={'timeout'} label="Timeout" required />
        <FormInputNumberItem name={'numkeys'} label={'Numkeys'} required />
        <FormListItem
          label="Keys"
          required
          name="keys"
          renderItem={(field) => {
            return <FormInputItem {...field} required />
          }}
        ></FormListItem>
        <FormRadioItem
          name={'wherefrom'}
          label={'Wherefrom'}
          required
          inputProps={{
            options: [
              { label: 'LEFT', value: 'LEFT' },
              { label: 'RIGHT', value: 'RIGHT' }
            ]
          }}
        ></FormRadioItem>
        <FormInputNumberItem name={'count'} label="Count" />
      </ModalForm>
    </VersionAccess>
  )
}
export default BLMPop
