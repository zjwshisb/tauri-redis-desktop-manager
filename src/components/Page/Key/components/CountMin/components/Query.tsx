import React from 'react'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'
import BaseKeyForm from '../../BaseKeyForm'
import ModalQueryForm from '@/components/ModalQueryForm'

const Query: React.FC<{
  keys: APP.CountMinKey
}> = (props) => {
  return (
    <ModalQueryForm
      title={'CMS.QUERY'}
      documentUrl="https://redis.io/commands/cms.query/"
      width={800}
      defaultValue={{
        name: props.keys.name,
        value: [undefined]
      }}
      onQuery={async (v) => {
        const res = await request('cms/query', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        return res.data
      }}
    >
      <BaseKeyForm>
        <FormListItem
          name="value"
          label="Items"
          required
          renderItem={(field) => {
            return <FormInputItem {...field} required />
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default Query
