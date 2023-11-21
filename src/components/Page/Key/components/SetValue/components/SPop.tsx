import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button } from 'antd'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const SPop: React.FC<{
  keys: APP.SetKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalQueryForm
      title="SPOP"
      width={400}
      afterQueryClose={onSuccess}
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/spop/"
      trigger={<Button type="primary">SPOP</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/spop',
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
      <FormInputItem name={'name'} label="Key" required />
      <FormInputNumberItem
        name={'value'}
        label={'Count'}
        inputProps={{
          min: 1
        }}
      ></FormInputNumberItem>
    </ModalQueryForm>
  )
}
export default SPop
