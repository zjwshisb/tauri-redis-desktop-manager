import React from 'react'

import useRequest from '@/hooks/useRequest'
import CusTable from '@/components/CusTable'
import { Descriptions, Space } from 'antd'
import ValueLayout from '../ValueLayout'
import { PlusOutlined } from '@ant-design/icons'
import { type Field } from 'ahooks/lib/useFusionTable/types'

import CusButton from '@/components/CusButton'

import Add from './components/Add'
import IncrBy from './components/IncrBy'
import Query from './components/Query'
import Count from './components/Count'

const TopKValue: React.FC<{
  keys: APP.TopKKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const {
    data: items,
    fetch,
    loading
  } = useRequest<Array<APP.Field<number>>>(
    'topk/list',
    keys.connection_id,
    {
      db: keys.db,
      name: keys.name
    },
    false
  )

  const { data: info, fetch: infoFetch } = useRequest<Field[]>(
    'topk/info',
    keys.connection_id,
    {
      db: keys.db,
      name: keys.name
    },
    false
  )

  React.useEffect(() => {
    fetch()
    infoFetch()
  }, [fetch, infoFetch, keys])

  return (
    <ValueLayout
      header={
        info != null && (
          <Descriptions
            size="small"
            bordered
            items={info.map((v) => {
              return {
                label: v.field,
                children: v.value
              }
            })}
          ></Descriptions>
        )
      }
      loading={loading}
      readonlyAction={
        <>
          <Query keys={keys} />
          <Count keys={keys} />
        </>
      }
      actions={
        <>
          <Add keys={keys} onSuccess={onRefresh} />
          <IncrBy
            keys={keys}
            onSuccess={onRefresh}
            defaultValue={{
              value: [
                {
                  field: undefined,
                  value: undefined
                }
              ]
            }}
          />
        </>
      }
    >
      <CusTable
        action={{
          render(_, record) {
            return (
              <Space>
                <IncrBy
                  onSuccess={onRefresh}
                  keys={keys}
                  trigger={
                    <CusButton
                      icon={<PlusOutlined></PlusOutlined>}
                      type="link"
                    ></CusButton>
                  }
                  defaultValue={{
                    value: [
                      {
                        field: record.field,
                        value: undefined
                      }
                    ]
                  }}
                />
              </Space>
            )
          }
        }}
        virtual={false}
        rowKey={'field'}
        dataSource={items}
        columns={[
          {
            dataIndex: 'field',
            title: 'Item'
          },
          {
            dataIndex: 'value',
            title: 'Count'
          }
        ]}
      ></CusTable>
    </ValueLayout>
  )
}
export default TopKValue
