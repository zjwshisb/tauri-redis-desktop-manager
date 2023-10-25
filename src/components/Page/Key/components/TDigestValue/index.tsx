import React from 'react'
import { Descriptions } from 'antd'

import ValueLayout from '../ValueLayout'
import useRequest from '@/hooks/useRequest'
import Add from './components/Add'
import Rank from './components/Rank'
import ByRank from './components/ByRank'
import RevRank from './components/RevRank'
import ByRevRank from './components/ByRevRank'
import Quantile from './components/Quantile'
import Reset from './components/Reset'
import Cdf from './components/Cdf'
import Max from './components/Max'
import Min from './components/Min'
import TrimmedMean from './components/TrimmedMean'
import CusTable from '@/components/CusTable'
const TDigestValue: React.FC<{
  keys: APP.TDigestKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const [columns, setColumns] = React.useState<
    Array<APP.Field<string | number>>
  >([])

  const [valueType, setValueType] = React.useState<
    'Rank' | 'Quantile' | 'Fraction'
  >('Rank')

  const { data: info, fetch } = useRequest<APP.Field[]>(
    'tdigest/info',
    keys.connection_id,
    {
      name: keys.name,
      db: keys.db
    },
    false
  )

  React.useEffect(() => {
    fetch()
  }, [fetch, keys])

  return (
    <ValueLayout
      readonlyAction={
        <>
          <Rank
            keys={keys}
            onSuccess={(f) => {
              setValueType('Rank')
              setColumns(f)
            }}
          ></Rank>
          <ByRank
            keys={keys}
            onSuccess={(f) => {
              setValueType('Rank')
              setColumns(f)
            }}
          ></ByRank>
          <RevRank
            keys={keys}
            onSuccess={(f) => {
              setValueType('Rank')
              setColumns(f)
            }}
          ></RevRank>
          <ByRevRank
            keys={keys}
            onSuccess={(f) => {
              setValueType('Rank')
              setColumns(f)
            }}
          ></ByRevRank>
          <Quantile
            keys={keys}
            onSuccess={(f) => {
              setValueType('Quantile')
              setColumns(f)
            }}
          ></Quantile>
          <Cdf
            keys={keys}
            onSuccess={(f) => {
              setValueType('Fraction')
              setColumns(f)
            }}
          ></Cdf>
          <Max keys={keys}></Max>
          <Min keys={keys}></Min>
          <TrimmedMean keys={keys} />
        </>
      }
      actions={
        <>
          <Reset keys={keys} onSuccess={onRefresh} />
          <Add keys={keys} onSuccess={onRefresh}></Add>
        </>
      }
      header={
        info !== undefined && (
          <Descriptions
            column={3}
            bordered
            size="small"
            items={info.map((v) => {
              return {
                label: v.field,
                children: v.value
              }
            })}
          ></Descriptions>
        )
      }
    >
      <CusTable
        virtual={false}
        rowKey={'label'}
        dataSource={columns}
        columns={[
          { dataIndex: 'field', title: 'Value', align: 'center' },
          {
            dataIndex: 'value',
            title: valueType,
            align: 'center'
          }
        ]}
      ></CusTable>
    </ValueLayout>
  )
}
export default TDigestValue
