import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const Decrby: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      title={'TS.DECRBY'}
      width={400}
      documentUrl="https://redis.io/commands/ts.decrby/"
      onSubmit={async (v) => {
        await request('timeseries/decrby', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <FormInputNumberItem
        name="field"
        label="Value"
        required
        tooltip="is numeric value of the subtrahend (double)."
      />
      <FormInputNumberItem
        inputProps={{
          min: 0
        }}
        name="value"
        label="Timestamp"
        tooltip="is Unix time (integer, in milliseconds) specifying the sample timestamp or * to set the sample timestamp to the Unix time of the server's clock."
      />
    </ModalForm>
  )
}
export default Decrby
