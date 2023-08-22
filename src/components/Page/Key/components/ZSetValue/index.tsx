import React from 'react'
import { Button, Space, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import ZRem from './components/ZRem'
import { observer } from 'mobx-react-lite'
import Form from './components/Form'
import { EditOutlined } from '@ant-design/icons'
import CusTable from '@/components/CusTable'
import IconButton from '@/components/IconButton'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'
import Editable from '@/components/Editable'
import { useFieldScan } from '@/hooks/useFieldScan'

const Index: React.FC<{
  keys: APP.ZSetKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const connection = React.useContext(context)

  const [params, setParams] = React.useState({ search: '' })

  const { t } = useTranslation()
  const { fields, more, loading, getFields } = useFieldScan<APP.ZSetField>(
    'key/zset/zscan',
    keys,
    params
  )

  return (
    <div>
      <div className="pb-2">
        <Space>
          <Editable connection={connection}>
            <Form
              onSuccess={onRefresh}
              keys={keys}
              trigger={<Button type="primary">ZAdd</Button>}
            ></Form>
          </Editable>
        </Space>
      </div>
      <CusTable
        loading={loading}
        more={more}
        onLoadMore={getFields}
        rowKey={'value'}
        dataSource={fields}
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
                      setParams({ search: e })
                    }}
                  />
                </div>
              </div>
            ),
            dataIndex: 'value',
            align: 'center',
            render(_) {
              return <FieldViewer content={_} />
            }
          },
          {
            dataIndex: 'score',
            title: t('Score'),
            width: 200,
            sorter: (a, b) => {
              if (a.score === b.score) {
                return 0
              }
              return a.score > b.score ? 1 : -1
            }
          },
          {
            title: t('Action'),
            width: 200,
            fixed: 'right',
            render(_, record, index) {
              return (
                <Space>
                  <Editable connection={connection}>
                    <ZRem
                      keys={keys}
                      value={record.value}
                      onSuccess={() => {
                        onRefresh()
                      }}
                    ></ZRem>
                  </Editable>
                  <Editable connection={connection}>
                    <Form
                      onSuccess={onRefresh}
                      keys={keys}
                      field={record}
                      trigger={<IconButton icon={<EditOutlined />} />}
                    ></Form>
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
