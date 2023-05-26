import React from 'react'
import { Button, Col, Input, Modal, Result, Row, Spin, message } from 'antd'
import StringValue from './components/StringValue'
import HashValue from './components/HashValue'
import ListValue from './components/ListValue'
import ZSetValue from './components/ZSetValue'
import SetValue from './components/SetValue'
import { ReloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import Copy from '@/components/Copy'
import useRequest from '@/hooks/useRequest'
import request from '@/utils/request'
import useStore from '@/hooks/useStore'
import Expire from './components/Expire'
import Rename from './components/Rename'
const Index: React.FC<{
  name: string
  connection: APP.Connection
  db: number
  pageKey: string
}> = ({ name, connection, db, pageKey }) => {
  const {
    data: item,
    fetch,
    loading,
    error
  } = useRequest<APP.Key>('key/get', connection.id, {
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
        case 'list': {
          return <ListValue keys={item} onRefresh={fetch} />
        }
        case 'zset': {
          return <ZSetValue keys={item} onRefresh={fetch} />
        }
        case 'set': {
          return <SetValue keys={item} onRefresh={fetch}></SetValue>
        }
      }
    }
    return <></>
  }, [item, fetch])

  const handleDelete = React.useCallback(() => {
    if (item !== undefined) {
      Modal.confirm({
        title: 'notice',
        content: `are sure delete key ${item.name}?`,
        async onOk() {
          await request('key/del', item?.connection_id, {
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

  if (error !== '') {
    return <Result status="warning" title={error}></Result>
  }

  return (
    <Spin spinning={loading}>
      {item !== undefined && (
        <div>
          <div className="pb-2">
            <Row>
              <Col span={24} className="mb-2">
                <Input
                  addonBefore={item.types}
                  value={item.name}
                  readOnly
                  addonAfter={
                    <Rename
                      trigger={<EditOutlined />}
                      keys={item}
                      onSuccess={(newName) => {
                        store.page.updatePage(pageKey, {
                          label: newName,
                          key: newName,
                          children: (
                            <Index
                              name={newName}
                              connection={connection}
                              db={db}
                              pageKey={newName}
                            ></Index>
                          )
                        })
                      }}
                    />
                  }
                ></Input>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={24} xl={6} className="mb-2">
                <Input
                  addonBefore={'ttl'}
                  value={item.ttl}
                  addonAfter={
                    <Expire
                      keys={item}
                      onSuccess={fetch}
                      trigger={<EditOutlined />}
                    />
                  }
                  readOnly
                ></Input>
              </Col>
              <Col xs={24} xl={6} className="mb-2">
                <Input
                  addonBefore={'memory'}
                  value={item.memory}
                  readOnly
                  suffix={'bytes'}
                ></Input>
              </Col>
              <Col xs={24} xl={6} className="mb-2">
                <Input
                  addonBefore={'length'}
                  value={item.length}
                  readOnly
                ></Input>
              </Col>
              <Col xs={24} xl={6} className="mb-2">
                <Button
                  className="mr-1 mb-2"
                  icon={<ReloadOutlined onClick={fetch} />}
                ></Button>
                <Button
                  className="mr-1 mb-2"
                  icon={<Copy content={item.name} />}
                ></Button>
                <Button
                  className="mr-1 mb-2"
                  onClick={handleDelete}
                  danger
                  type="primary"
                  icon={<DeleteOutlined />}
                ></Button>
              </Col>
            </Row>
          </div>

          <div>{value}</div>
        </div>
      )}
    </Spin>
  )
}

export default Index
