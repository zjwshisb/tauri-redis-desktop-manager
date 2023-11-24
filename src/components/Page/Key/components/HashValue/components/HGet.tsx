import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import BaseKeyForm from '../../BaseKeyForm'
import FormInputItem from '@/components/Form/FormInputItem'

const HGet: React.FC<{
  keys: APP.HashKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="HGET"
      width={400}
      documentUrl="https://redis.io/commands/hget/"
      defaultValue={{
        name: keys.name
      }}
      onQuery={async (v) => {
        const res = await request(
          'hash/hget',
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
        <FormInputItem name={'value'} label={'Field'} required />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default HGet
