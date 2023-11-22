import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import { type FormInstance } from 'antd/lib'
import lodash from 'lodash'
import TimeSeriesItem from '@/Layout/Keys/components/Add/components/TimeSeriesItem'
import BaseKeyForm from '../../BaseKeyForm'

const Alter: React.FC<{
  keys: APP.TimeSeriesKey
  onSuccess: () => void
  info: Array<APP.Field<string | number | APP.Field[] | APP.Field[][]>>
}> = ({ keys, onSuccess, info }) => {
  const form = React.useRef<FormInstance>(null)

  const defaultValue = React.useMemo(() => {
    let labels = lodash.cloneDeep(info.find((v) => v.field === 'labels')?.value)
    if (labels !== undefined && labels !== null) {
      labels = (labels as APP.Field[][]).map((v) => {
        return v[0]
      })
    }
    return {
      name: keys.name,
      rentention: info.find((v) => v.field === 'retentionTime')?.value,
      size: info.find((v) => v.field === 'chunkSize')?.value,
      policy: info.find((v) => v.field === 'duplicatePolicy')?.value,
      labels
    }
  }, [info, keys.name])

  return (
    <ModalForm
      defaultValue={defaultValue}
      ref={form}
      title="TS.ALTER"
      documentUrl="https://redis.io/commands/ts.alter/"
      width={400}
      onSubmit={async (v) => {
        await request('timeseries/alter', keys.connection_id, {
          db: keys.db,

          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <BaseKeyForm>
        <TimeSeriesItem type="alter"></TimeSeriesItem>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default Alter
