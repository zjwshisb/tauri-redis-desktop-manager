import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button } from 'antd'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'

const SDiff: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SDIFF"
      width={400}
      defaultValue={{
        value: [keys.name, undefined]
      }}
      documentUrl="https://redis.io/commands/sdiff/"
      trigger={<Button type="primary">SDIFF</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/sdiff',
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
        renderItem={(p) => {
          return <FormInputItem {...p} required />
        }}
      ></FormListItem>
    </ModalQueryForm>
  )
}
export default SDiff
