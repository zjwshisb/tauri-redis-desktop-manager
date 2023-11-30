import React from 'react'
import request from '@/utils/request'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormListItem from '@/components/Form/FormListItem'

import ModalQueryForm from '@/components/ModalQueryForm'

const ZMScore: React.FC<{
  keys: APP.ZSetKey
}> = (props) => {
  return (
    <ModalQueryForm
      documentUrl="https://redis.io/commands/zmscore/"
      defaultValue={{
        name: props.keys.name,
        value: [undefined]
      }}
      onQuery={async (v) => {
        const res = await request<number>(
          'zset/zmscore',
          props.keys.connection_id,
          {
            name: props.keys.name,
            db: props.keys.db,
            ...v
          },
          {
            showNotice: false
          }
        )
        return res.data
      }}
      title={'ZMSCORE'}
    >
      <BaseKeyForm>
        <FormListItem
          name={'value'}
          renderItem={(f) => {
            return <FormInputJsonItem {...f} required />
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default ZMScore
