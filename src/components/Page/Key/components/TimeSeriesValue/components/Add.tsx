import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import BaseKeyForm from '../../BaseKeyForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const Add: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      title={'TS.ADD'}
      width={400}
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/ts.add/"
      onSubmit={async (v) => {
        await request('timeseries/add', keys.connection_id, {
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
          tooltip="is (double) numeric data value of the sample. The double number should follow RFC 7159 (JSON standard). In particular, the parser rejects overly large values that do not fit in binary64. It does not accept NaN or infinite values."
        />
        <FormInputNumberItem
          inputProps={{
            min: 0
          }}
          name="value"
          label="Timestamp"
          required
          tooltip="is Unix time (integer, in milliseconds) specifying the sample timestamp or * to set the sample timestamp to the Unix time of the server's clock."
        />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default Add
