import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import BaseKeyForm from '../../BaseKeyForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const Incrby: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      title={'TS.INCRBY'}
      defaultValue={{
        name: keys.name
      }}
      width={400}
      documentUrl="https://redis.io/commands/ts.incrby/"
      onSubmit={async (v) => {
        await request('timeseries/incrby', keys.connection_id, {
          db: keys.db,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <BaseKeyForm>
        <FormInputNumberItem
          name="field"
          label="Value"
          required
          tooltip="is numeric value of the addend (double)."
          inputProps={{
            stringMode: true
          }}
        ></FormInputNumberItem>
        <FormInputNumberItem
          name="value"
          label="Timestamp"
          tooltip="is Unix time (integer, in milliseconds) specifying the sample timestamp or * to set the sample timestamp to the Unix time of the server's clock."
          inputProps={{
            min: 0
          }}
        ></FormInputNumberItem>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default Incrby
