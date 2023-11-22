import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'

import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

const LRange: React.FC<{
  keys: APP.ListKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="LRANGE"
      width={400}
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/lrange/"
      onQuery={async (v) => {
        const res = await request(
          'list/lrange',
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
      <BaseKeyForm>
        <FormInputNumberItem name={'start'} label={'Start'} required />
        <FormInputNumberItem name={'end'} label={'Stop'} required />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default LRange
