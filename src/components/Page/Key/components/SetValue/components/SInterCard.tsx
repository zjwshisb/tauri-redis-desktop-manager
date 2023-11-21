import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button } from 'antd'
import FormListItem from '@/components/Form/FormListItem'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
const SInterCard: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="7.0.0">
      <ModalQueryForm
        title="SINTERCARD"
        width={400}
        defaultValue={{
          keys: [keys.name, undefined]
        }}
        documentUrl="https://redis.io/commands/sintercard/"
        trigger={<Button type="primary">SINTERCARD</Button>}
        onQuery={async (v) => {
          const res = await request(
            'set/sintercard',
            keys.connection_id,
            {
              db: keys.db,
              ...v
            },
            {
              showNotice: false
            }
          )
          return res.data
        }}
      >
        <FormInputNumberItem name={'numkeys'} label={'numkeys'} required />
        <FormListItem
          name="keys"
          label="Keys"
          required
          renderItem={(f) => {
            return <FormInputItem {...f} required />
          }}
        ></FormListItem>
        <FormInputNumberItem name={'limit'} label={'limit'} />
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default SInterCard
