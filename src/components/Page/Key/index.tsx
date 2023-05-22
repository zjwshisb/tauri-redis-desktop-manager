import React from 'react'
import { Button, Input, Modal, Spin, message } from 'antd'
import StringValue from './components/StringValue'
import HashValue from './components/HashValue'
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import Copy from '@/components/Copy'
import useRequest from '@/hooks/useRequest'
import request from '@/utils/request'
import useStore from '@/hooks/useStore'

const Index: React.FC<{
  name: string
  connection: APP.Connection
  db: number
  pageKey: string
}> = ({ name, connection, db, pageKey }) => {
  const { data: item, fetch, loading } = useRequest<APP.Key>('key/get', connection.id, {
    name,
    db
  })

  const store = useStore()

  const value = React.useMemo(() => {
    if (item !== undefined) {
      switch (item.types) {
        case 'string': {
          return <StringValue value={item.data} />
        }
        case 'hash': {
          return <HashValue keys={item} />
        }
      }
    }
    return <></>
  }, [item])

  const handleDelete = React.useCallback(() => {
    if (item !== undefined) {
      Modal.confirm({
        title: 'notice',
        content: `are sure delete key ${item.name as string}?`,
        onOk () {
          return request('key/del', item?.connection_id, {
            db: item?.db,
            names: [item?.name]
          }).then(() => {
            message.success('success')
            store.page.removePage(pageKey)
          })
        }
      })
    }
  }, [item, pageKey, store.page])

  if (item === undefined) {
    return <></>
  }

  return <Spin spinning={loading}><div>
        <div className={'flex pb-4'}>
          <div className='w-[300px]'>
            <Input addonBefore={item.types} value={item.name} readOnly
            addonAfter={
              <Copy content={item.name} />
            }
            ></Input>
          </div>
          <div className='w-[300px] ml-4'>
            <Input addonBefore={'ttl'} value={item.ttl} readOnly></Input>
          </div>
          <div>
            <Button className='ml-2' icon={
              <ReloadOutlined onClick={fetch} />
            }>
            </Button>
            <Button className='ml-2'
            onClick={handleDelete}
            danger type='primary' icon={
              <DeleteOutlined />
            }>
            </Button>
          </div>
        </div>
        <div >
            {value}
         </div>
    </div>
    </Spin>
}

export default Index
