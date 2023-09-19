import React from 'react'
import {
  CaretRightFilled,
  DisconnectOutlined,
  ReloadOutlined,
  WarningOutlined,
  LoadingOutlined
} from '@ant-design/icons'
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
import { computed } from 'mobx'

const Connection: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const store = useStore()

  const [collapse, setCollapse] = React.useState(false)

  const { t } = useTranslation()

  const onTrigger = React.useCallback(() => {
    setCollapse((prev) => !prev)
  }, [])

  const icon = React.useMemo(() => {
    if (connection.loading === true) {
      return <LoadingOutlined className="text-sm mr-1"></LoadingOutlined>
    }
    if (connection.open === true) {
      if (collapse) {
        return (
          <CaretRightFilled
            className="text-sm mr-1 rotate-90 transition-all"
            onClick={onTrigger}
          />
        )
      } else {
        return (
          <CaretRightFilled
            className="text-sm mr-1 transition-all"
            onClick={onTrigger}
          />
        )
      }
    } else {
      return <DisconnectOutlined className="text-sm mr-1" />
    }
  }, [collapse, connection.loading, connection.open, onTrigger])

  const openConnection = React.useCallback(async () => {
    if (connection.loading !== true) {
      if (connection.open !== true) {
        try {
          await store.connection.open(connection.id)
          const key = getPageKey('info', connection)
          store.page.addPage({
            label: key,
            type: 'info',
            key,
            children: <Info connection={connection} pageKey={key}></Info>,
            connection
          })
          setCollapse(true)
        } catch {}
      }
    }
  }, [connection, store.connection, store.page])

  const onItemClickTh = useThrottleFn(openConnection, {
    wait: 300
  })

  const height = React.useMemo(() => {
    if (connection.open === true && collapse) {
      let count = 0
      if (connection.is_cluster) {
        count = connection.nodes !== undefined ? connection.nodes.length : 0
      } else {
        count = connection.dbs !== undefined ? connection.dbs.length : 0
      }
      return (22 * count).toString() + 'px'
    } else {
      return 0
    }
  }, [
    connection.open,
    connection.is_cluster,
    connection.nodes,
    connection.dbs,
    collapse
  ])

  const children = computed(() => {
    if (connection.is_cluster) {
      const active = store.keyInfo.info?.connection.id === connection.id
      return connection.nodes?.map((v) => {
        return (
          <NodeItem
            key={v.id}
            node={v}
            connection={connection}
            active={active}
          ></NodeItem>
        )
      })
    } else {
      return connection.dbs?.map((db) => {
        const active =
          store.keyInfo.info?.connection.id === connection.id &&
          store.keyInfo.info?.db === db.database
        return (
          <DBItem
            item={db}
            connection={connection}
            active={active}
            key={db.database}
          ></DBItem>
        )
      })
    }
  }).get()

  return (
    <div className={'box-border '}>
      <div className={'flex justify-between text-lg px-2  py-1 active-able'}>
        <div className={'flex overflow-hidden flex-1'}>
          {icon}
          <Tooltip
            mouseEnterDelay={0.6}
            title={
              <div className="break-all">
                {connection.host}:{connection.port}
              </div>
            }
          >
            <div className="truncate flex-1" onDoubleClick={onItemClickTh.run}>
              <span className="pr-2 text-gray-600">#{connection.id}</span>
              {connection.host}:{connection.port}
            </div>
          </Tooltip>
        </div>
        <div className={'flex-shrink-0 pl-2'}>
          <Space>
            {connection.err !== undefined && (
              <Tooltip title={connection.err}>
                <WarningOutlined className="text-orange-600"></WarningOutlined>
              </Tooltip>
            )}
            {connection.open === true && (
              <>
                <Tooltip title={t('Refresh')}>
                  <ReloadOutlined
                    className="hover:text-blue-600"
                    onClick={(e) => {
                      store.connection.getInfo(connection)
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
        className="overflow-hidden transition-all"
        style={{
          height
        }}
      >
        {children}
      </div>
    </div>
  )
}
export default observer(Connection)
