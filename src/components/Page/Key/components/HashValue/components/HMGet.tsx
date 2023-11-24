import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import BaseKeyForm from '../../BaseKeyForm'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'

const HMGet: React.FC<{
  keys: APP.HashKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="HMGET"
      width={400}
      documentUrl="https://redis.io/commands/hmget/"
      defaultValue={{
        name: keys.name,
        value: [undefined]
      }}
      onQuery={async (v) => {
        const res = await request(
          'hash/hmget',
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
        <FormListItem
          required
          name={'value'}
          label="Fields"
          renderItem={(f) => {
            return <FormInputItem required {...f} />
          }}
        />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default HMGet
