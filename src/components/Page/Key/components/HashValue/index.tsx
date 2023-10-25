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
import useTableColumn from '@/hooks/useTableColumn'
import ValueLayout from '../ValueLayout'
import LoadMore from '@/components/LoadMore'

const HashValue: React.FC<{
  keys: APP.HashKey
}> = ({ keys }) => {
  const connection = useContext(context)
  const [params, setParams] = useState({
    search: ''
  })
  const { t } = useTranslation()

  const { fields, setFields, getFields, loading, more, getAllFields } =
    useFieldScan<APP.Field>('key/hash/hscan', keys, params)

  const columns = useTableColumn<APP.Field>(
    [
      {
        dataIndex: 'field',
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
      }
    ],
    {
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
    },
    connection !== undefined && !connection.readonly
  )

  return (
    <ValueLayout
      actions={
        <FieldForm
          keys={keys}
          onSuccess={(f) => {
            setFields((p) => {
              return [...p].concat([f])
            })
          }}
          trigger={<Button type="primary">{t('Add Field')}</Button>}
        />
      }
    >
      <CusTable
        loading={loading}
        rowKey={'name'}
        more={more}
        onLoadMore={getFields}
        dataSource={fields}
        columns={columns}
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
export default HashValue
