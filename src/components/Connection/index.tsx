import React from 'react'
import {
  RightOutlined,
  DownOutlined,
  DisconnectOutlined,
  ReloadOutlined,
  LoadingOutlined
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
  const [databases, setDatabases] = React.useState<number[]>([])
  const [nodes, setNodes] = React.useState<string[]>([])

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
      setDatabases(dbs)
      setLoading(false)
    } catch (e) {
      setLoading(false)
      throw e
    }
  }, [connection.id])

  const getNodes = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await request<string[]>('cluster/nodes', connection.id)
      setNodes(res.data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
      throw e
    }
  }, [connection.id])

  const openConnection = React.useCallback(async () => {
    await request('connections/open', connection.id)
  }, [connection.id])

  const onItemClick = React.useCallback(async () => {
    if (isOpen) {
      setCollapse((p) => !p)
    } else {
      await openConnection()
      if (connection.is_cluster) {
        await getNodes()
      } else {
        await getDbs()
      }
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
    getDbs,
    getNodes,
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
        count = nodes.length
      } else {
        count = databases.length
      }
      return (22 * count).toString() + 'px'
    } else {
      return 0
    }
  }, [collapse, connection.is_cluster, databases.length, isOpen, nodes.length])

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
            <span className="pr-2">#{connection.id}</span>
            {connection.host}:{connection.port}
          </div>
        </div>
        <div className={'flex-shrink-0 pl-2'}>
          <Space>
            {isOpen && (
              <>
                <Tooltip title={t('Refresh')}>
                  <ReloadOutlined
                    className="hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      getDbs()
                    }}
                  ></ReloadOutlined>
                </Tooltip>
                <Menu connection={connection} db={databases} />
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
            ? nodes.map((v) => {
                return (
                  <NodeItem
                    key={v}
                    server={v}
                    connection={connection}
                  ></NodeItem>
                )
              })
            : databases.map((item) => {
                const active =
                  store.db.db?.connection.id === connection.id &&
                  store.db.db?.db === item
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
