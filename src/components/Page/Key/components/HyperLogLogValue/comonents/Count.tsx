import React from 'react'

import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import ModalQueryForm from '@/components/ModalQueryForm'
import FormInputItem from '@/components/Form/FormInputItem'

const Add: React.FC<{
  keys: APP.HyperLogLogKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      defaultValue={{
        name: [keys.name]
      }}
      title={'PFCOUNT'}
      documentUrl="https://redis.io/commands/pfcount/"
      width={400}
      onQuery={async (v) => {
        const res = await request(
          'hyperloglog/pfcount',
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
        label="Name"
        renderItem={({ name, ...restField }) => {
          return <FormInputItem {...restField} name={[name]} required />
        }}
      ></FormListItem>
    </ModalQueryForm>
  )
}
export default Add
