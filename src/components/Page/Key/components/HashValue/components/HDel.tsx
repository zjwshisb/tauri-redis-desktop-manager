import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'

import BaseKeyForm from '../../BaseKeyForm'
import FormInputItem from '@/components/Form/FormInputItem'
import FormListItem from '@/components/Form/FormListItem'

const HDel: React.FC<{
  keys: APP.HashKey
  onSuccess: () => void
  trigger?: React.ReactElement
  defaultValue?: Record<string, any>
}> = (props) => {
  return (
    <ModalForm
      width={400}
      trigger={props.trigger}
      documentUrl="https://redis.io/commands/hdel/"
      defaultValue={{
        name: props.keys.name,
        value: [undefined],
        ...props.defaultValue
      }}
      onSubmit={async (v) => {
        await request<number>('hash/hdel', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'HDEL'}
    >
      <BaseKeyForm>
        <FormListItem
          name={'value'}
          label="Fields"
          required
          renderItem={(f) => {
            return <FormInputItem {...f} required></FormInputItem>
          }}
        />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default HDel
