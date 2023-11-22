import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'

const MGet: React.FC<{
  keys: APP.StringKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="MGET"
      width={400}
      defaultValue={{
        name: [keys.name]
      }}
      documentUrl="https://redis.io/commands/mget/"
      onQuery={async (v) => {
        const res = await request<string>(
          'string/mget',
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
      <FormListItem
        name="name"
        label="Keys"
        renderItem={({ name, ...restField }) => {
          return <FormInputItem {...restField} name={[name]} required />
        }}
      ></FormListItem>
    </ModalQueryForm>
  )
}
export default MGet
