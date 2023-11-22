import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'

import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

const LPop: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalQueryForm
      title="LPOP"
      width={400}
      afterQueryClose={onSuccess}
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/lpop/"
      onQuery={async (v) => {
        const res = await request(
          'list/lpop',
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
          label={'Count'}
          name={'value'}
          inputProps={{
            min: 0
          }}
        />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default LPop
