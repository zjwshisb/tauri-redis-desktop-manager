import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'

import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

const LTrim: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      width={400}
      documentUrl="https://redis.io/commands/ltrim/"
      defaultValue={{
        name: props.keys.name
      }}
      onSubmit={async (v) => {
        await request<number>('list/ltrim', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'LTRIM'}
    >
      <BaseKeyForm>
        <FormInputNumberItem
          name={'start'}
          label={'Start'}
          required
          inputProps={{ precision: 0 }}
        />
        <FormInputNumberItem
          name={'end'}
          label={'Stop'}
          required
          inputProps={{ precision: 0 }}
        />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default LTrim
