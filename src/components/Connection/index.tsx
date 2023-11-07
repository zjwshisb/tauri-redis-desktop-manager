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
import { Button, Spin, Tooltip } from 'antd'
import DBItem from './components/DBItem'
import NodeItem from './components/NodeItem'
import CurlMenu from './components/CurlMenu'
import Menu from './components/Menu'
import { useTranslation } from 'react-i18next'
import { computed } from 'mobx'
import InteractiveContainer from '../InteractiveContainer'

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
      return <LoadingOutlined></LoadingOutlined>
    }
    if (connection.open === true) {
      if (collapse) {
        return <CaretRightFilled className="rotate-90 transition-all" />
      } else {
        return <CaretRightFilled className="transition-all" />
      }
    } else {
      return <DisconnectOutlined />
    }
  }, [collapse, connection.loading, connection.open])

  const openConnection = React.useCallback(async () => {
    if (connection.loading !== true) {
      if (connection.open !== true) {
        try {
          await store.connection.open(connection.id)
          store.page.addPage({
            type: 'info',
            name: 'info',
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
      return (24 * count).toString() + 'px'
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
    <div className={'box-border'}>
      <InteractiveContainer
        className={'flex justify-between text-lg px-2  py-1'}
      >
        <div className={'flex overflow-hidden flex-1 items-center'}>
          <span className="text-sm mr-1 ">{icon}</span>
          <div
            className="truncate flex-1"
            onDoubleClick={onItemClickTh.run}
            onClick={onTrigger}
          >
            <span className="pr-2 ">#{connection.id}</span>
            {connection.name}
          </div>
        </div>
        <div className={'flex-shrink-0 pl-2'}>
          {connection.err !== undefined && (
            <Tooltip title={connection.err} color="volcano">
              <WarningOutlined className="text-orange-600"></WarningOutlined>
            </Tooltip>
          )}
          {connection.open === true && (
            <>
              <Tooltip title={t('Refresh')}>
                <Button
                  size="small"
                  type="text"
                  icon={<ReloadOutlined></ReloadOutlined>}
                  onClick={(e) => {
                    store.connection.getInfo(connection)
                    e.stopPropagation()
                  }}
                ></Button>
              </Tooltip>
              <Menu connection={connection} />
            </>
          )}
          <CurlMenu
            connection={connection}
            onOpen={() => {
              setCollapse(true)
            }}
          />
        </div>
      </InteractiveContainer>
      <div
        className="overflow-hidden transition-all"
        style={{
          height
        }}
      >
        <Spin spinning={connection.loading}>{children}</Spin>
      </div>
    </div>
  )
}
export default observer(Connection)
