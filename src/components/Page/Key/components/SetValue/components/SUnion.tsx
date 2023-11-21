import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button } from 'antd'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'

const SUnion: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SUNION"
      width={400}
      defaultValue={{
        value: [keys.name, undefined]
      }}
      documentUrl="https://redis.io/commands/sunion/"
      trigger={<Button type="primary">SUNION</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/sunion',
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
export default SUnion
