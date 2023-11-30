import React from 'react'
import request from '@/utils/request'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

import ModalQueryForm from '@/components/ModalQueryForm'

const ZScore: React.FC<{
  keys: APP.ZSetKey
}> = (props) => {
  return (
    <ModalQueryForm
      documentUrl="https://redis.io/commands/zscore/"
      defaultValue={{
        name: props.keys.name,
        value: [undefined]
      }}
      onQuery={async (v) => {
        const res = await request<number>(
          'zset/zscore',
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
      title={'ZSCORE'}
    >
      <BaseKeyForm>
        <FormInputJsonItem label="Member" name={'value'} required />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default ZScore
