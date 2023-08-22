import React from 'react'
import { Input, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import SAdd from './components/SAdd'
import SRem from './components/SRem'
import { observer } from 'mobx-react-lite'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'
import Editable from '@/components/Editable'
import { useFieldScan } from '@/hooks/useFieldScan'

const Index: React.FC<{
  keys: APP.SetKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const { t } = useTranslation()

  const connection = React.useContext(context)

  const [params, setParams] = React.useState({
    search: ''
  })

  const { fields, loading, more, getFields } = useFieldScan<string>(
    'key/set/sscan',
    keys,
    params
  )

  return (
    <div>
      <Space className="pb-2">
        <Editable connection={connection}>
          <SAdd
            keys={keys}
            onSuccess={() => {
              onRefresh()
            }}
          ></SAdd>
        </Editable>
      </Space>
      <CusTable
        loading={loading}
        more={more}
        onLoadMore={getFields}
        rowKey={'value'}
        dataSource={fields.map((v, index) => {
          return {
            index: index + 1,
            value: v
          }
        })}
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
            align: 'center',
            sorter: (a, b) => {
              return a.value > b.value ? 1 : -1
            },
            render(_) {
              return <FieldViewer content={_}></FieldViewer>
            }
          },
          {
            title: t('Action'),
            width: '200px',
            fixed: 'right',
            align: 'center',
            render(_, record, index) {
              return (
                <Space>
                  <Editable connection={connection}>
                    <SRem
                      keys={keys}
                      value={record.value}
                      onSuccess={() => {
                        onRefresh()
                      }}
                    ></SRem>
                  </Editable>
                </Space>
              )
            }
          }
        ]}
      ></CusTable>
    </div>
  )
}
export default observer(Index)
