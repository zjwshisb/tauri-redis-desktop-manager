import React, { useContext } from 'react'
import request from '@/utils/request'
import { Button, Space, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import FieldForm from './components/FieldForm'
import DeleteField from './components/DeleteField'
import { useTranslation } from 'react-i18next'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'
import IconButton from '@/components/IconButton'
import context from '../../context'
import Editable from '@/components/Editable'

const Index: React.FC<{
  keys: APP.HashKey
}> = ({ keys }) => {
  const store = useStore()

  const [fields, setFields] = React.useState<APP.HashField[]>([])
  const cursor = React.useRef('0')
  const [more, setMore] = React.useState(true)
  const search = React.useRef('')

  const [loading, setLoading] = React.useState(false)

  const { t } = useTranslation()

  const connection = useContext(context)

  const getFields = React.useCallback(
    (reset = false) => {
      if (reset) {
        cursor.current = '0'
      }
      setLoading(true)
      request<{
        cursor: string
        fields: APP.HashField[]
      }>('key/hash/hscan', keys.connection_id, {
        name: keys.name,
        db: keys.db,
        cursor: cursor.current,
        count: store.setting.setting.field_count,
        search: search.current
      })
        .then((res) => {
          cursor.current = res.data.cursor
          if (res.data.cursor === '0') {
            setMore(false)
          } else {
            setMore(true)
          }
          if (reset) {
            setFields(res.data.fields)
          } else {
            setFields((p) => [...p].concat(res.data.fields))
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [keys, store.setting.setting.field_count]
  )

  React.useEffect(() => {
    cursor.current = '0'
    setMore(true)
    getFields(true)
  }, [getFields])

  return (
    <div>
      <div className="pb-2 flex">
        <Editable connection={connection}>
          <FieldForm
            keys={keys}
            onSuccess={(f) => {
              setFields((p) => {
                return [...p].concat([f])
              })
            }}
            trigger={<Button type="primary">{t('Add Field')}</Button>}
          />
        </Editable>
      </div>
      <CusTable
        loading={loading}
        rowKey={'name'}
        more={more}
        onLoadMore={getFields}
        dataSource={fields}
        columns={[
          {
            dataIndex: 'name',
            width: 200,
            title: (
              <div className="flex items-center justify-center">
                <div>{t('Field Name')}</div>
                <div
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Input.Search
                    allowClear
                    size="small"
                    onSearch={(e) => {
                      search.current = e
                      getFields(true)
                    }}
                  />
                </div>
              </div>
            )
          },
          {
            dataIndex: 'value',
            title: t('Field Value'),
            render(_, record) {
              return <FieldViewer content={_}></FieldViewer>
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
                    <FieldForm
                      trigger={<IconButton icon={<EditOutlined />} />}
                      keys={keys}
                      field={record}
                      onSuccess={(f) => {
                        setFields((prev) => {
                          const newFields = [...prev]
                          newFields[index] = f
                          return newFields
                        })
                      }}
                    />
                  </Editable>
                  <Editable connection={connection}>
                    <DeleteField
                      keys={keys}
                      field={record}
                      onSuccess={() => {
                        setFields((prev) => {
                          const newFields = [...prev]
                          newFields.splice(index, 1)
                          return newFields
                        })
                      }}
                    />
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
export default Index
