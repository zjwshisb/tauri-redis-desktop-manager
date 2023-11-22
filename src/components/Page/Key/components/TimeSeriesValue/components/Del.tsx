import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

const Del: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      title={'TS.DEL'}
      documentUrl="https://redis.io/commands/ts.del/"
      width={400}
      defaultValue={{
        name: keys.name
      }}
      onSubmit={async (v) => {
        await request('timeseries/del', keys.connection_id, {
          db: keys.db,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <BaseKeyForm>
        <FormInputNumberItem
          name="start"
          label="Form Timestamp"
          required
          inputProps={{ min: 0 }}
        />
        <FormInputNumberItem
          name="end"
          label="To Timestamp"
          required
          inputProps={{ min: 0 }}
        />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default Del
