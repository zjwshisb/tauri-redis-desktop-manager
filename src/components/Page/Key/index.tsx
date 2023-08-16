import React from 'react'
import { Button, Input, Modal, Result, Space, Spin, message } from 'antd'
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
import Rename from './components/Rename'
import { useTranslation } from 'react-i18next'
import TTL from './components/TTL'
import { getPageKey } from '@/utils'
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

  const { t } = useTranslation()

  const value = React.useMemo(() => {
    if (item !== undefined) {
      switch (item.types) {
        case 'string': {
          return <StringValue keys={item} onRefresh={fetch} />
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
        title: t('Notice'),
        content: t('Are you sure delete <{{name}}>?', {
          name: item.name
        }),
        async onOk() {
          await request('key/del', item?.connection_id, {
            db: item.db,
            names: [item.name]
          }).then(() => {
            message.success('success')
            store.page.removePage(pageKey)
          })
        }
      })
    }
  }, [item, pageKey, store.page, t])

  if (error !== '') {
    return <Result status="warning" title={error}></Result>
  }

  return (
    <Spin spinning={loading}>
      {item !== undefined && (
        <div>
          <div className="pb-2">
            <div className="w-full mb-2">
              <Input
                addonBefore={t(
                  item.types.slice(0, 1).toUpperCase() +
                    item.types.slice(1).toLowerCase()
                )}
                value={item.name}
                readOnly
                addonAfter={
                  <Rename
                    trigger={<EditOutlined />}
                    keys={item}
                    onSuccess={(newName) => {
                      const newPageKey = getPageKey(newName, connection, db)
                      store.page.updatePage(pageKey, {
                        type: 'key',
                        label: newPageKey,
                        key: newPageKey,
                        connection,
                        name: newName,
                        db,
                        children: (
                          <Index
                            name={newName}
                            connection={connection}
                            db={db}
                            pageKey={newPageKey}
                          ></Index>
                        )
                      })
                    }}
                  />
                }
              ></Input>
            </div>
            <div className="w-full flex flex-wrap">
              <div className="mb-2 mr-2 w-[200px]">
                <TTL keys={item} onChange={fetch}></TTL>
              </div>
              <div className="mb-2 mr-2 w-[200px]">
                <Input
                  addonBefore={t('Memory')}
                  value={item.memory}
                  readOnly
                  suffix={'bytes'}
                ></Input>
              </div>
              <div className="mb-2 mr-2 w-[200px]">
                <Input
                  addonBefore={t('Length')}
                  value={item.length}
                  readOnly
                ></Input>
              </div>
              <div className="mb-2 mr-2 w-[200px]">
                <Space>
                  <Button
                    className="mb-2"
                    icon={<ReloadOutlined onClick={fetch} />}
                  ></Button>
                  <Button
                    className="mb-2"
                    icon={<Copy content={item.name} />}
                  ></Button>
                  <Button
                    className="mb-2"
                    onClick={handleDelete}
                    danger
                    type="primary"
                    icon={<DeleteOutlined />}
                  ></Button>
                </Space>
              </div>
            </div>
          </div>
          <div>{value}</div>
        </div>
      )}
    </Spin>
  )
}

export default Index
