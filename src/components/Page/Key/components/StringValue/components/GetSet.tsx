import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const GetSet: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalQueryForm
      title="GETSET"
      width={400}
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/getset/"
      afterQueryClose={onSuccess}
      onQuery={async (v) => {
        const res = await request<string>(
          'string/getset',
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
        <FormInputJsonItem label="Value" name="value" required />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default GetSet
