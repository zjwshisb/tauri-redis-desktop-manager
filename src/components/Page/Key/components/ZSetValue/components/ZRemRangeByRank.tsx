import React from 'react'
import request from '@/utils/request'

import ModalQueryForm from '@/components/ModalQueryForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'
import BaseKeyForm from '../../BaseKeyForm'

const ZRemRangeByRank: React.FC<{
  keys: APP.ZSetKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="2.0.0">
      <ModalQueryForm
        defaultValue={{
          name: props.keys.name
        }}
        width={500}
        afterQueryClose={props.onSuccess}
        documentUrl="https://redis.io/commands/zremrangebyrank/"
        onQuery={async (v) => {
          const res = await request<number>(
            'zset/zremrangebyrank',
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
        title={'ZREMRANGEBYRANK'}
      >
        <BaseKeyForm>
          <FormInputItem label="Start" name="start" required />
          <FormInputItem label="Stop" name="end" required />
        </BaseKeyForm>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default ZRemRangeByRank
