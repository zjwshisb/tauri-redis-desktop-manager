import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormInputItem from '@/components/Form/FormInputItem'

const DeleteRule: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/ts.deleterule/"
      defaultValue={{
        source_key: keys.name
      }}
      title="TS.DELETERULE"
      width={400}
      onSubmit={async (v) => {
        await request('timeseries/delete-rule', keys.connection_id, {
          db: keys.db,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <FormInputItem
        name="source_key"
        label="sourceKey"
        tooltip="is key name for the source time series."
        required
      ></FormInputItem>
      <FormInputItem
        name="dest_key"
        label="destKey"
        tooltip="is key name for destination (compacted) time series."
        required
      ></FormInputItem>
    </ModalForm>
  )
}
export default DeleteRule
