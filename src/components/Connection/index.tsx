import React from 'react'
import {
  CaretRightFilled,
  DisconnectOutlined,
  ReloadOutlined,
  KeyOutlined
} from '@ant-design/icons'
import classnames from 'classnames'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import { useThrottleFn } from 'ahooks'
import { Space, Tooltip } from 'antd'
import DBItem from './components/DBItem'
import NodeItem from './components/NodeItem'
import CurlMenu from './components/CurlMenu'
import Menu from './components/Menu'
import { useTranslation } from 'react-i18next'
import Info from '@/components/Page/Info'
import { getPageKey } from '@/utils'

const Connection: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const store = useStore()

  const [collapse, setCollapse] = React.useState(false)

  const isOpen = React.useMemo(() => {
    return store.connection.openIds[connection.id]
  }, [connection.id, store.connection.openIds])
  const { t } = useTranslation()

  const icon = React.useMemo(() => {
    if (isOpen) {
      if (collapse) {
        return (
          <CaretRightFilled className="text-sm mr-1 rotate-90 transition-all" />
        )
      } else {
        return <CaretRightFilled className="text-sm mr-1 transition-all" />
      }
    } else {
      return <DisconnectOutlined className="text-sm mr-1" />
    }
  }, [collapse, isOpen])

  const onItemClick = React.useCallback(async () => {
    if (isOpen) {
      setCollapse((p) => !p)
    } else {
      try {
        await store.connection.open(connection.id)
        const key = getPageKey('info', connection)
        store.page.addPage({
          label: key,
          type: 'info',
          key,
          children: <Info connection={connection}></Info>,
          connection
        })
        setCollapse(true)
      } catch {}
    }
  }, [connection, isOpen, store.connection, store.page])

  const onItemClickTh = useThrottleFn(onItemClick, {
    wait: 300
  })

  const height = React.useMemo(() => {
    if (isOpen && collapse) {
      let count = 0
      if (connection.is_cluster) {
        count = connection.nodes.length
      } else {
        count = connection.dbs.length
      }
      return (22 * count).toString() + 'px'
    } else {
      return 0
    }
  }, [
    isOpen,
    collapse,
    connection.is_cluster,
    connection.nodes.length,
    connection.dbs.length
  ])

  return (
    <div className={'my-2 px-2 box-border'}>
      <div
        className={
          'flex justify-between rounded hover:bg-gray-100 hover:cursor-pointer text-lg'
        }
      >
        <div
          className={'flex overflow-hidden flex-1'}
          onClick={onItemClickTh.run}
        >
          {icon}
          <div className="truncate">
            <span className="pr-2 text-gray-600">#{connection.id}</span>
            {connection.host}:{connection.port}
          </div>
        </div>
        <div className={'flex-shrink-0 pl-2'}>
          <Space>
            {isOpen && (
              <>
                {connection.is_cluster && (
                  <Tooltip title={'keys'}>
                    <KeyOutlined
                      onClick={() => {
                        store.keyInfo.set(connection)
                      }}
                    />
                  </Tooltip>
                )}

                <Tooltip title={t('Refresh')}>
                  <ReloadOutlined
                    className="hover:text-blue-600"
                    onClick={(e) => {
                      store.connection.open(connection.id)
                      e.stopPropagation()
                    }}
                  ></ReloadOutlined>
                </Tooltip>
                <Menu connection={connection} />
              </>
            )}
            <CurlMenu connection={connection} />
          </Space>
        </div>
      </div>
      <div
        className={classnames(['overflow-hidden transition-all'])}
        style={{
          height
        }}
      >
        {connection.is_cluster
          ? connection.nodes.map((v) => {
              const active =
                store.keyInfo.info?.connection.id === connection.id &&
                store.keyInfo.info?.node === v
              return (
                <NodeItem
                  key={v}
                  node={v}
                  active={active}
                  connection={connection}
                ></NodeItem>
              )
            })
          : connection.dbs.map((db) => {
              const active =
                store.keyInfo.info?.connection.id === connection.id &&
                store.keyInfo.info?.db === db
              return (
                <DBItem
                  db={db}
                  connection={connection}
                  active={active}
                  key={db}
                ></DBItem>
              )
            })}
      </div>
    </div>
  )
}
export default observer(Connection)
