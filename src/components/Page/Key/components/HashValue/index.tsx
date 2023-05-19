import React from 'react'
import request from '../../../../../utils/request'
import { Button, Space, Table, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import useStore from '../../../../../hooks/useStore'
import { useMount } from 'ahooks'

const Index: React.FC<{
  item: APP.HashKey
}> = ({ item }) => {
  const store = useStore()

  const [fields, setFields] = React.useState<APP.Field[]>([])
  const [cursor, setCursor] = React.useState('0')
  const [more, setMore] = React.useState(true)

  const getFields = React.useCallback((c: string, reset = false) => {
    request<{
      cursor: string
      fields: APP.Field[]
    }>('key/hscan', {
      key: item.name,
      cursor: c
    }).then(res => {
      setCursor(res.data.cursor)
      if (res.data.cursor === '0') {
        setMore(false)
      }
      if (reset) {
        setFields(res.data.fields)
      } else {
        setFields(p => [...p].concat(res.data.fields))
      }
    })
  }, [item.name])

  useMount(() => {
    getFields(cursor, true)
  })

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
          render (_, record) {
            return <Space>
              <EditOutlined className='hover:cursor-pointer' />
              <DeleteOutlined className='hover:cursor-pointer' />
              <EyeOutlined className='hover:cursor-pointer' onClick={() => {
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
        getFields(cursor)
      }}>load more</Button>}
    </div>
}
export default Index
