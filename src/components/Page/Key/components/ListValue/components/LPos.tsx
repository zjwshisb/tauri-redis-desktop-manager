import React from 'react'
import request from '@/utils/request'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import ModalQueryForm from '@/components/ModalQueryForm'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

const LPos: React.FC<{
  keys: APP.ListKey
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="6.0.6" connection={connection}>
      <ModalQueryForm
        width={500}
        documentUrl="https://redis.io/commands/lpos/"
        defaultValue={{
          name: props.keys.name
        }}
        onQuery={async (v) => {
          return await request<number>('list/lpos', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          }).then((r) => r.data)
        }}
        title={'LPOS'}
      >
        <BaseKeyForm>
          <FormInputItem name={'element'} label={'Element'} required />
          <FormInputNumberItem name={'rank'} label={'Rank'} />
          <FormInputNumberItem name={'count'} label={'Count'} />
          <FormInputNumberItem name={'len'} label={'MaxLen'} />
        </BaseKeyForm>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default LPos
