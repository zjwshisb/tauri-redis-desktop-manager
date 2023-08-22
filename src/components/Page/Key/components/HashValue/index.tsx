import React, { useContext, useState } from 'react'
import { Button, Space, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import FieldForm from './components/FieldForm'
import DeleteField from './components/DeleteField'
import { useTranslation } from 'react-i18next'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'
import IconButton from '@/components/IconButton'
import context from '../../context'
import Editable from '@/components/Editable'
import { useFieldScan } from '@/hooks/useFieldScan'

const Index: React.FC<{
  keys: APP.HashKey
}> = ({ keys }) => {
  const connection = useContext(context)
  const [params, setParams] = useState({
    search: ''
  })
  const { t } = useTranslation()

  const { fields, setFields, getFields, loading, more } =
    useFieldScan<APP.HashField>('key/hash/hscan', keys, params)

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
                      setParams({
                        search: e
                      })
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
