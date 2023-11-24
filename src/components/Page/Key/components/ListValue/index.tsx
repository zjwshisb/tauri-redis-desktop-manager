import React from 'react'
import request from '@/utils/request'
import { Space } from 'antd'
import LTrim from './components/LTrim'
import LSet from './components/LSet'
import LInsert from './components/LInsert'
import LPush from './components/LPush'
import LPop from './components/LPop'
import RPush from './components/RPush'
import RPop from './components/RPop'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'

import ValueLayout from '../ValueLayout'
import LoadMore from '@/components/LoadMore'
import BLMove from './components/BLMove'
import BLMPop from './components/BLMPop'
import BLPop from './components/BLPop'
import BRPop from './components/BRPop'
import BRPopLPush from './components/BRPopLPush'
import LIndex from './components/LIndex'
import LLen from './components/LLen'
import LMove from './components/LMove'
import LMPop from './components/LMPop'
import LPos from './components/LPos'
import LPushX from './components/LPushX'
import LRange from './components/LRange'
import LRem from './components/LRem'
import { EditOutlined } from '@ant-design/icons'
import RPopLPush from './components/RPopLPush'
import RPushX from './components/RPushX'
import CusButton from '@/components/CusButton'

const ListValue: React.FC<{
  keys: APP.ListKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const store = useStore()

  const [items, setItems] = React.useState<string[]>([])

  const [loading, setLoading] = React.useState(false)

  const [more, setMore] = React.useState(true)

  const index = React.useRef(0)

  const connection = React.useContext(context)

  const getFields = React.useCallback(
    async (reset = false) => {
      const start = index.current
      const end = index.current + store.setting.setting.field_count - 1
      setLoading(true)
      return await request<string[]>('list/lrange', keys.connection_id, {
        name: keys.name,
        db: keys.db,
        start,
        end
      })
        .then((res) => {
          index.current = end
          const more = end >= keys.length
          if (reset) {
            setItems(res.data)
          } else {
            setItems((p) => {
              return [...p].concat(res.data)
            })
          }
          return {
            more
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [keys, store.setting.setting.field_count]
  )

  const getAllFields = React.useCallback(() => {
    getFields().then((res) => {
      if (res.more) {
        getAllFields()
      }
    })
  }, [getFields])

  const data = React.useMemo(() => {
    return items.map((v, index) => {
      return {
        value: v,
        index
      }
    })
  }, [items])

  React.useEffect(() => {
    if (items.length >= keys.length) {
      setMore(false)
    } else {
      setMore(true)
    }
  }, [items.length, keys.length])

  React.useEffect(() => {
    index.current = 0
    getFields(true)
  }, [getFields])

  return (
    <ValueLayout
      readonlyAction={
        <>
          <LIndex keys={keys} />
          <LLen keys={keys} />
          <LPos keys={keys} />
          <LRange keys={keys} />
        </>
      }
      actions={
        <>
          <BLMove keys={keys} onSuccess={onRefresh} />
          <BLMPop keys={keys} onSuccess={onRefresh} />
          <BLPop keys={keys} onSuccess={onRefresh} />
          <BRPop keys={keys} onSuccess={onRefresh} />
          <BRPopLPush keys={keys} onSuccess={onRefresh} />
          <LInsert keys={keys} onSuccess={onRefresh} />
          <LMove keys={keys} onSuccess={onRefresh} />
          <LMPop keys={keys} onSuccess={onRefresh} />
          <LPop keys={keys} onSuccess={onRefresh} />
          <LPush keys={keys} onSuccess={onRefresh} />
          <LPushX keys={keys} onSuccess={onRefresh} />
          <LRem keys={keys} onSuccess={onRefresh} />
          <LSet
            keys={keys}
            trigger={<CusButton>LSET</CusButton>}
            defaultValue={{
              name: keys.name
            }}
            onSuccess={() => {
              onRefresh()
            }}
          />
          <LTrim keys={keys} onSuccess={onRefresh} />
          <RPop keys={keys} onSuccess={onRefresh} />
          <RPopLPush keys={keys} onSuccess={onRefresh} />
          <RPush keys={keys} onSuccess={onRefresh} />
          <RPushX keys={keys} onSuccess={onRefresh} />
        </>
      }
    >
      <CusTable
        more={more}
        loading={loading}
        rowKey={'index'}
        onLoadMore={getFields}
        readonly={connection?.readonly}
        dataSource={data}
        action={{
          render(_, record, index) {
            return (
              <Space>
                <LSet
                  keys={keys}
                  trigger={<CusButton type="link" icon={<EditOutlined />} />}
                  defaultValue={{
                    field: index,
                    value: record.value,
                    name: keys.name
                  }}
                  onSuccess={() => {
                    onRefresh()
                  }}
                />
              </Space>
            )
          }
        }}
        columns={[
          {
            title: 'Index',
            dataIndex: 'index',
            align: 'center',
            width: 100
          },
          {
            dataIndex: 'value',
            title: 'Value',
            width: 'auto',
            render(_) {
              return <FieldViewer content={_} />
            }
          }
        ]}
      ></CusTable>
      <div className="py-2 mb-4">
        <LoadMore
          disabled={!more}
          loading={loading}
          onGet={async () => {
            await getFields()
          }}
          onGetAll={getAllFields}
        ></LoadMore>
      </div>
    </ValueLayout>
  )
}
export default observer(ListValue)
