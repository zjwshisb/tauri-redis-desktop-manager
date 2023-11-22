import React from 'react'
import { App, Input, Result, Space } from 'antd'
import StringValue from './components/StringValue'
import HashValue from './components/HashValue'
import ListValue from './components/ListValue'
import ZSetValue from './components/ZSetValue'
import SetValue from './components/SetValue'
import JsonValue from './components/JsonValue'
import TopKValue from './components/TopkValue'
import TimeSeriesValue from './components/TimeSeriesValue'
import TDigestValue from './components/TDigestValue'
import BloomFilterValue from './components/BloomFilterValue'
import HyperLogLogValue from './components/HyperLogLogValue'
import CuckooFilterKey from './components/CuckooFilterValue'
import Name from './components/Name'
import Dump from './components/Dump'
import { DeleteOutlined } from '@ant-design/icons'
import Copy from '@/components/Copy'
import useRequest from '@/hooks/useRequest'
import request from '@/utils/request'
import useStore from '@/hooks/useStore'
import { useTranslation } from 'react-i18next'
import TTL from './components/TTL'
import Editable from '@/components/Editable'
import Context from './context'
import Page from '..'
import CusButton from '@/components/CusButton'

function isShowLength(types: APP.Key['types']) {
  return (
    types !== 'ReJSON-RL' &&
    types !== 'TopK-TYPE' &&
    types !== 'TSDB-TYPE' &&
    types !== 'TDIS-TYPE' &&
    types !== 'MBbloomCF'
  )
}

const Key: React.FC<{
  name: string
  connection: APP.Connection
  db?: number
  pageKey: string
}> = ({ name, connection, db, pageKey }) => {
  const {
    data: item,
    fetch,
    loading,
    error
  } = useRequest<APP.Key>(
    'key/get',
    connection.id,
    {
      name,
      db
    },
    true,
    {
      showNotice: false
    }
  )

  const store = useStore()

  const { t } = useTranslation()

  const { modal, message } = App.useApp()

  const value = React.useMemo(() => {
    if (item !== undefined) {
      switch (item.types) {
        case 'string': {
          switch (item.sub_types) {
            case 'HyperLogLog': {
              return <HyperLogLogValue keys={item} onRefresh={fetch} />
            }
            default: {
              return <StringValue keys={item} onRefresh={fetch} />
            }
          }
        }
        case 'hash': {
          return <HashValue keys={item} onRefresh={fetch} />
        }
        case 'list': {
          return <ListValue keys={item} onRefresh={fetch} />
        }
        case 'zset': {
          return <ZSetValue keys={item} onRefresh={fetch} />
        }
        case 'set': {
          return <SetValue keys={item} onRefresh={fetch} />
        }
        case 'ReJSON-RL': {
          return <JsonValue keys={item} onRefresh={fetch} />
        }
        case 'TopK-TYPE': {
          return <TopKValue keys={item} onRefresh={fetch} />
        }
        case 'TSDB-TYPE': {
          return <TimeSeriesValue keys={item} onRefresh={fetch} />
        }
        case 'TDIS-TYPE': {
          return <TDigestValue keys={item} onRefresh={fetch} />
        }
        case 'MBbloom--': {
          return <BloomFilterValue keys={item} onRefresh={fetch} />
        }
        case 'MBbloomCF': {
          return (
            <CuckooFilterKey keys={item} onRefresh={fetch}></CuckooFilterKey>
          )
        }
      }
    }
    return <></>
  }, [item, fetch])

  const handleDelete = React.useCallback(() => {
    if (item !== undefined) {
      modal.confirm({
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
  }, [item, message, modal, pageKey, store.page, t])

  if (error !== '') {
    return <Result status="warning" title={error}></Result>
  }

  return (
    <Page pageKey={pageKey} onRefresh={fetch} loading={loading}>
      <Context.Provider value={connection}>
        {item !== undefined && (
          <div>
            <div className="mb-2">
              <div className="w-full mb-2">
                <Name
                  keys={item}
                  onChange={(newName) => {
                    const newPage = store.page.createPage({
                      type: 'key',
                      connection,
                      name: newName,
                      db: item.db
                    })
                    store.page.updatePage(pageKey, newPage)
                  }}
                ></Name>
              </div>
              <Space wrap>
                <div className="w-[300px]">
                  <TTL keys={item} onChange={fetch}></TTL>
                </div>
                <div className="w-[300px]">
                  <Input
                    addonBefore={'Memory Usage'}
                    value={item.memory}
                    readOnly
                    suffix={'bytes'}
                  ></Input>
                </div>
                {isShowLength(item.types) && (
                  <div className="w-[200px]">
                    <Input
                      addonBefore={'Length'}
                      value={item.length}
                      readOnly
                    ></Input>
                  </div>
                )}
                <Copy content={item.name} isButton />
                <Dump keys={item}></Dump>
                <Editable connection={connection}>
                  <CusButton
                    onClick={handleDelete}
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                  ></CusButton>
                </Editable>
              </Space>
            </div>
            <div>{value}</div>
          </div>
        )}
      </Context.Provider>
    </Page>
  )
}

export default Key
