import React from 'react'
import {
  RightOutlined,
  DownOutlined,
  DisconnectOutlined,
  ReloadOutlined,
  LoadingOutlined,
  KeyOutlined
} from '@ant-design/icons'
import classnames from 'classnames'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import request from '@/utils/request'
import { useThrottleFn } from 'ahooks'
import { Space, Spin, Tooltip } from 'antd'
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

  const [loading, setLoading] = React.useState(false)

  const isOpen = React.useMemo(() => {
    return store.connection.openIds[connection.id]
  }, [connection.id, store.connection.openIds])
  const { t } = useTranslation()

  const icon = React.useMemo(() => {
    if (loading) {
      return (
        <LoadingOutlined spin={true} className="text-sm mr-1"></LoadingOutlined>
      )
    }
    if (isOpen) {
      if (collapse) {
        return <DownOutlined className="text-sm mr-1" />
      } else {
        return <RightOutlined className="text-sm mr-1" />
      }
    } else {
      return <DisconnectOutlined className="text-sm mr-1" />
    }
  }, [collapse, isOpen, loading])

  const getDbs = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await request<string>('config/databases', connection.id)
      const count = parseInt(res.data)
      const dbs: number[] = []
      for (let i = 0; i < count; i++) {
        dbs.push(i)
      }
      store.connection.update(connection.id, {
        dbs
      })
      setLoading(false)
    } catch (e) {
      setLoading(false)
      throw e
    }
  }, [connection.id, store.connection])

  const getNodes = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await request<string[]>('cluster/nodes', connection.id)
      store.connection.update(connection.id, {
        nodes: res.data
      })
      setLoading(false)
    } catch (e) {
      setLoading(false)
      throw e
    }
  }, [connection.id, store.connection])

  const getConnectionInfo = React.useCallback(async () => {
    if (connection.is_cluster) {
      await getNodes()
    } else {
      await getDbs()
    }
  }, [connection.is_cluster, getDbs, getNodes])

  const openConnection = React.useCallback(async () => {
    await request('connections/open', connection.id)
  }, [connection.id])

  const getVersion = React.useCallback(async () => {
    const res = await request<string>('server/version', connection.id)
    store.connection.update(connection.id, {
      version: res.data
    })
  }, [connection.id, store.connection])

  const onItemClick = React.useCallback(async () => {
    if (isOpen) {
      setCollapse((p) => !p)
    } else {
      await openConnection()
      getConnectionInfo()
      getVersion()
      store.connection.open(connection.id)
      const key = getPageKey('info', connection)
      store.page.addPage({
        label: key,
        key,
        children: <Info connection={connection}></Info>,
        connectionId: connection.id
      })
      setCollapse(true)
    }
  }, [
    connection,
    getConnectionInfo,
    getVersion,
    isOpen,
    openConnection,
    store.connection,
    store.page
  ])

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
                      getConnectionInfo()
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
        <Spin spinning={loading}>
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
            : connection.dbs.map((item) => {
                const active =
                  store.keyInfo.info?.connection.id === connection.id &&
                  store.keyInfo.info?.db === item
                return (
                  <DBItem
                    db={item}
                    connection={connection}
                    active={active}
                    key={item}
                  ></DBItem>
                )
              })}
        </Spin>
      </div>
    </div>
  )
}
export default observer(Connection)
