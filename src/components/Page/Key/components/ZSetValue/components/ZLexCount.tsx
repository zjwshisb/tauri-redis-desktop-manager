import React from 'react'
import request from '@/utils/request'

import ModalQueryForm from '@/components/ModalQueryForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'
import BaseKeyForm from '../../BaseKeyForm'

const ZLexCount: React.FC<{
  keys: APP.ZSetKey
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="2.8.9">
      <ModalQueryForm
        defaultValue={{
          name: props.keys.name
        }}
        width={500}
        documentUrl="https://redis.io/commands/zlexcount/"
        onQuery={async (v) => {
          const res = await request<number>(
            'zset/zlexcount',
            props.keys.connection_id,
            {
              db: props.keys.db,
              ...v
            },
            {
              showNotice: false
            }
          )
          return res.data
        }}
        title={'ZLEXCOUNT'}
      >
        <BaseKeyForm>
          <FormInputItem label="Min" name="start" required />
          <FormInputItem label="Max" name="end" required />
        </BaseKeyForm>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default ZLexCount
