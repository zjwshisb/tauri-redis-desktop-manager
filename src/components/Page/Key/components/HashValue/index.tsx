import React from 'react'
import request from '@/utils/request'
import { Button, Space, Table, Tooltip } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import EditField from './components/EditField'
import DeleteField from './components/DeleteField'
import { actionIconStyle } from '@/utils/styles'

const Index: React.FC<{
  keys: APP.HashKey
}> = ({ keys }) => {
  const store = useStore()

  const [fields, setFields] = React.useState<APP.Field[]>([])
  const cursor = React.useRef('0')
  const [more, setMore] = React.useState(true)

  const getFields = React.useCallback((reset = false) => {
    request<{
      cursor: string
      fields: APP.Field[]
    }>('key/hash/hscan', keys.connection_id, {
      name: keys.name,
      db: keys.db,
      cursor: cursor.current
    }).then(res => {
      cursor.current = res.data.cursor
      if (res.data.cursor === '0') {
        setMore(false)
      }
      if (reset) {
        setFields(res.data.fields)
      } else {
        setFields(p => [...p].concat(res.data.fields))
      }
    })
  }, [keys])

  React.useEffect(() => {
    cursor.current = '0'
    setMore(true)
    getFields(true)
  }, [getFields])

  return <div>
    <Table
      pagination={false}
      className='w-100'
      scroll={{
        x: 'auto'
      }}
      key={'name'}
      dataSource={fields} bordered columns={[
        {
          title: '#',
          render (r, d, index) {
            return index + 1
          }
        },
        {
          dataIndex: 'name',
          title: 'key',
          sorter: (a, b) => a.name > b.name ? 1 : -1
        },
        {
          dataIndex: 'value',
          title: 'value',
          render (_, record) {
            return <Tooltip title={_}>
              {_}
            </Tooltip>
          }
        },
        {
          title: 'action',
          width: '300px',
          fixed: 'right',
          render (_, record, index) {
            return <Space>
              <EditField keys={keys} field={record} onSuccess={f => {
                setFields(prev => {
                  const newFields = [...prev]
                  newFields[index] = f
                  return newFields
                })
                console.log(f)
              }} />
              <DeleteField keys={keys} field={record} onSuccess={() => {
                setFields(prev => {
                  const newFields = [...prev]
                  newFields.splice(index, 1)
                  return newFields
                })
              }}/>
              <EyeOutlined style={actionIconStyle} className='hover:cursor-pointer' key={'view'} onClick={() => {
                store.fieldView.show({
                  title: record.name,
                  content: record.value
                })
              }}/>
            </Space>
          }
        }
      ]}></Table>
      {more && <Button block className='my-4' onClick={() => {
        getFields()
      }}>load more</Button>}
    </div>
}
export default Index
