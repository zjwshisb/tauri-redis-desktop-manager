import React from 'react'
import request from '@/utils/request'
import { Button, Space, Table, Tooltip, Input } from 'antd'
import { EyeOutlined, EditOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import FieldForm from './components/FieldForm'
import DeleteField from './components/DeleteField'
import { actionIconStyle } from '@/utils/styles'
import { useTranslation } from 'react-i18next'

const Index: React.FC<{
  keys: APP.HashKey
}> = ({ keys }) => {
  const store = useStore()

  const [fields, setFields] = React.useState<APP.HashField[]>([])
  const cursor = React.useRef('0')
  const [more, setMore] = React.useState(true)
  const search = React.useRef('')

  const { t } = useTranslation()

  const getFields = React.useCallback(
    (reset = false) => {
      if (reset) {
        cursor.current = '0'
      }
      request<{
        cursor: string
        fields: APP.HashField[]
      }>('key/hash/hscan', keys.connection_id, {
        name: keys.name,
        db: keys.db,
        cursor: cursor.current,
        count: store.setting.field_count,
        search: search.current
      }).then((res) => {
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
    },
    [keys, store.setting.field_count]
  )

  React.useEffect(() => {
    cursor.current = '0'
    setMore(true)
    getFields(true)
  }, [getFields])

  return (
    <div>
      <div>
        <FieldForm
          keys={keys}
          onSuccess={(f) => {
            setFields((p) => {
              return [...p].concat([f])
            })
          }}
          trigger={
            <Button type="primary" className="mb-4">
              {t('Add Field')}
            </Button>
          }
        />
      </div>
      <Table
        pagination={false}
        scroll={{
          x: 'auto'
        }}
        rowKey={'name'}
        dataSource={fields}
        bordered
        columns={[
          {
            title: '#',
            render(r, d, index) {
              return index + 1
            }
          },
          {
            dataIndex: 'name',

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
            width: 500,
            title: t('Field Value'),
            render(_, record) {
              return <Tooltip title={_}>{_}</Tooltip>
            }
          },
          {
            title: t('Action'),
            width: '300px',
            fixed: 'right',
            render(_, record, index) {
              return (
                <Space>
                  <FieldForm
                    trigger={
                      <EditOutlined
                        className="hover:cursor-pointer"
                        style={actionIconStyle}
                      ></EditOutlined>
                    }
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
                  <EyeOutlined
                    style={actionIconStyle}
                    className="hover:cursor-pointer"
                    key={'view'}
                    onClick={() => {
                      store.fieldView.show({
                        title: record.name,
                        content: record.value
                      })
                    }}
                  />
                </Space>
              )
            }
          }
        ]}
      ></Table>
      <Button
        disabled={!more}
        block
        className="my-4"
        onClick={() => {
          getFields()
        }}
      >
        {t('Load More')}
      </Button>
    </div>
  )
}
export default Index
