import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'

const SInter: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SINTER"
      width={400}
      defaultValue={{
        value: [keys.name, undefined]
      }}
      documentUrl="https://redis.io/commands/sinter/"
      onQuery={async (v) => {
        const res = await request(
          'set/sinter',
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
        name="value"
        label="Keys"
        required
        renderItem={(f) => {
          return <FormInputItem {...f} required />
        }}
      ></FormListItem>
    </ModalQueryForm>
  )
}
export default SInter
