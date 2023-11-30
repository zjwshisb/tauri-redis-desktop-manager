import React from 'react'
import request from '@/utils/request'

import ModalQueryForm from '@/components/ModalQueryForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'
import BaseKeyForm from '../../BaseKeyForm'

const ZRemRangeByScore: React.FC<{
  keys: APP.ZSetKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="1.2.0">
      <ModalQueryForm
        defaultValue={{
          name: props.keys.name
        }}
        width={500}
        afterQueryClose={props.onSuccess}
        documentUrl="https://redis.io/commands/zremrangebyscore/"
        onQuery={async (v) => {
          const res = await request<number>(
            'zset/zremrangebyscore',
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
        title={'ZREMRANGEBYSCORE'}
      >
        <BaseKeyForm>
          <FormInputItem label="Min" name="start" required />
          <FormInputItem label="Max" name="end" required />
        </BaseKeyForm>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default ZRemRangeByScore
