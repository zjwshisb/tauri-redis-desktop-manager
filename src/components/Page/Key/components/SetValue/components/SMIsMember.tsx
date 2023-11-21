import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button } from 'antd'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'

const SMIsMember: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SMISMEMBER"
      width={400}
      defaultValue={{
        value: [undefined],
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/smismember/"
      trigger={<Button type="primary">SMISMEMBER</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/smismember',
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
      <FormInputItem name={'name'} label={'Key'} required />
      <FormListItem
        required
        label="Members"
        name="value"
        renderItem={(field) => {
          return <FormInputItem required {...field} />
        }}
      ></FormListItem>
    </ModalQueryForm>
  )
}
export default SMIsMember
