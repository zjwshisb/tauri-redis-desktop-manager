import React from 'react'
import { Input, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import SAdd from './components/SAdd'
import SRem from './components/SRem'
import { observer } from 'mobx-react-lite'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'
import { useFieldScan } from '@/hooks/useFieldScan'
import ValueLayout from '../ValueLayout'
import LoadMore from '@/components/LoadMore'
import SDiff from './components/SDiff'
import SDiffStore from './components/SDiffStore'
import SInter from './components/SInter'
import SInterCard from './components/SInterCard'
import SInterStore from './components/SInterStore'
import SIsMember from './components/SIsMember'
import SMembers from './components/SMembers'
import SMIsMember from './components/SMIsMember'
import SMove from './components/SMove'
import { DeleteOutlined, ScissorOutlined } from '@ant-design/icons'
import SPop from './components/SPop'
import SRandMember from './components/SRandMember'
import SUnion from './components/SUnion'
import SUnionStore from './components/SUnionStore'
import CusButton from '@/components/CusButton'

const SetValue: React.FC<{
  keys: APP.SetKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const { t } = useTranslation()

  const connection = React.useContext(context)

  const [params, setParams] = React.useState({
    search: ''
  })

  const { fields, loading, more, getFields, getAllFields } =
    useFieldScan<string>('set/sscan', keys, params)

  const data = React.useMemo(() => {
    return fields.map((v, index) => {
      return {
        index: index + 1,
        value: v
      }
    })
  }, [fields])

  return (
    <ValueLayout
      readonlyAction={
        <>
          <SDiff keys={keys} />
          <SInter keys={keys} />
          <SInterCard keys={keys} />
          <SIsMember keys={keys} />
          <SMIsMember keys={keys} />
          <SMembers keys={keys} />
          <SRandMember keys={keys} />
          <SUnion keys={keys} />
        </>
      }
      actions={
        <>
          <SAdd keys={keys} onSuccess={onRefresh}></SAdd>
          <SDiffStore keys={keys} />
          <SInterStore keys={keys} />
          <SMove
            onSuccess={onRefresh}
            defaultValue={{
              name: keys.name
            }}
            keys={keys}
            trigger={<CusButton>SMOVE</CusButton>}
          ></SMove>
          <SPop keys={keys} onSuccess={onRefresh}></SPop>
          <SRem
            trigger={<CusButton>SREM</CusButton>}
            keys={keys}
            onSuccess={onRefresh}
            defaultValue={{ value: [undefined], name: keys.name }}
          />
          <SUnionStore keys={keys} />
        </>
      }
    >
      <CusTable
        addIndex
        readonly={connection?.readonly}
        action={{
          width: 200,
          render(_, record) {
            return (
              <Space>
                <SRem
                  trigger={
                    <CusButton
                      type="link"
                      icon={<DeleteOutlined />}
                    ></CusButton>
                  }
                  keys={keys}
                  defaultValue={{
                    name: keys.name,
                    value: [record.value]
                  }}
                  onSuccess={() => {
                    onRefresh()
                  }}
                ></SRem>
                <SMove
                  onSuccess={onRefresh}
                  defaultValue={{
                    name: keys.name,
                    value: record.value
                  }}
                  keys={keys}
                  trigger={
                    <CusButton
                      type="link"
                      icon={<ScissorOutlined />}
                    ></CusButton>
                  }
                ></SMove>
              </Space>
            )
          }
        }}
        loading={loading}
        more={more}
        onLoadMore={getFields}
        rowKey={'value'}
        dataSource={data}
        columns={[
          {
            title: (
              <div className="flex items-center justify-center">
                <div>{t('Value')}</div>
                <div
                  className="w-30 ml-2"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Input.Search
                    allowClear
                    size="small"
                    onSearch={(e) => {
                      setParams({
                        search: e
                      })
                    }}
                  />
                </div>
              </div>
            ),
            dataIndex: 'value',
            sorter: (a, b) => {
              return a.value > b.value ? 1 : -1
            },
            render(_) {
              return <FieldViewer content={_}></FieldViewer>
            }
          }
        ]}
      ></CusTable>
      <div className="py-2 mb-4">
        <LoadMore
          disabled={!more}
          loading={loading}
          onGet={async () => await getFields()}
          onGetAll={getAllFields}
        />
      </div>
    </ValueLayout>
  )
}
export default observer(SetValue)
