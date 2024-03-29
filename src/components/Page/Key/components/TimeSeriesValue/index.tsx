import React from 'react'

import ValueLayout from '../ValueLayout'
import useRequest from '@/hooks/useRequest'
import { Descriptions, Space } from 'antd'
import { isArray } from 'lodash'
import CusTable from '@/components/CusTable'

import Add from './components/Add'
import Del from './components/Del'
import Incrby from './components/Incrby'
import Decrby from './components/Decrby'
import Alter from './components/Alter'
import DeleteRule from './components/DeleteRule'

import CreateRule from './components/CreateRule'

const TimeSeriesValue: React.FC<{
  keys: APP.TimeSeriesKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const {
    data: info,
    fetch,
    loading
  } = useRequest<APP.Field[]>(
    'timeseries/info',
    keys.connection_id,
    {
      db: keys.db,
      name: keys.name
    },
    false
  )

  const { data: items, fetch: fetchItems } = useRequest<APP.Field[]>(
    'timeseries/range',
    keys.connection_id,
    {
      db: keys.db,
      name: keys.name
    },
    false
  )

  React.useEffect(() => {
    fetch()
    fetchItems()
  }, [fetch, fetchItems, keys])

  const header = React.useMemo(() => {
    if (info === undefined) {
      return undefined
    }
    return (
      <Descriptions
        bordered
        size="small"
        column={3}
        items={info.map((v) => {
          return {
            label: v.field,
            children: isArray(v.value)
              ? v.value.map((v, index) => {
                  if (isArray(v)) {
                    return (
                      <div key={index}>
                        {v.map((vv: APP.Field) => {
                          return (
                            <span key={vv.field}>
                              {vv.field}: {vv.value};
                            </span>
                          )
                        })}
                      </div>
                    )
                  }
                  return <span key={index}>{v};</span>
                })
              : v.value
          }
        })}
      ></Descriptions>
    )
  }, [info])

  return (
    <ValueLayout
      loading={loading}
      actions={
        <Space>
          {info != null && (
            <Alter keys={keys} info={info} onSuccess={onRefresh} />
          )}
          <Add keys={keys} onSuccess={onRefresh} />
          <Incrby keys={keys} onSuccess={onRefresh} />
          <Decrby keys={keys} onSuccess={onRefresh} />
          <CreateRule keys={keys} onSuccess={onRefresh} />
          <DeleteRule keys={keys} onSuccess={onRefresh} />
          <Del keys={keys} onSuccess={onRefresh} />
        </Space>
      }
      header={header}
    >
      <CusTable
        dataSource={items}
        columns={[
          {
            dataIndex: 'field',
            title: 'Value'
          },
          {
            dataIndex: 'value',
            title: 'Timestamp'
          }
        ]}
      ></CusTable>
    </ValueLayout>
  )
}
export default TimeSeriesValue
