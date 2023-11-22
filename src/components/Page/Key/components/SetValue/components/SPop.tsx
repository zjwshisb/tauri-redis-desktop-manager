import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

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
      <BaseKeyForm>
        <FormInputNumberItem
          name={'value'}
          label={'Count'}
          inputProps={{
            min: 1
          }}
        ></FormInputNumberItem>
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default SPop
