import React from 'react'
import request from '@/utils/request'

import ModalQueryForm from '@/components/ModalQueryForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import BaseKeyForm from '../../BaseKeyForm'
import FormInputItem from '@/components/Form/FormInputItem'
import FormCheckBoxItem from '@/components/Form/FormCheckBoxItem'

const ZRevRank: React.FC<{
  keys: APP.ZSetKey
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="2.0.0">
      <ModalQueryForm
        defaultValue={{
          name: props.keys.name
        }}
        width={500}
        documentUrl="https://redis.io/commands/zrevrank/"
        onQuery={async (v) => {
          const res = await request<number>(
            'zset/zrevrank',
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
        title={'ZREVRANK'}
      >
        <BaseKeyForm>
          <FormInputItem name={'field'} required label="Member" />
          <FormCheckBoxItem name={'value'} label="Withscore" />
        </BaseKeyForm>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default ZRevRank
