import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

const GetRange: React.FC<{
  keys: APP.StringKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="GETRANGE"
      width={400}
      documentUrl="https://redis.io/commands/getrange/"
      defaultValue={{
        name: keys.name
      }}
      onQuery={async (v) => {
        const res = await request<string>(
          'string/getrange',
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
          name={'start'}
          label="Start"
          required
          inputProps={{ precision: 0 }}
        />
        <FormInputNumberItem
          name={'end'}
          label="End"
          required
          inputProps={{ precision: 0 }}
        />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default GetRange
