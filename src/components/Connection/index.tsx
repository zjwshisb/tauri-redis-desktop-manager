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
import { Tooltip } from 'antd'
import DBItem from './components/DBItem'
import NodeItem from './components/NodeItem'
import CurlMenu from './components/CurlMenu'
import Menu from './components/Menu'
import { useTranslation } from 'react-i18next'
import { computed } from 'mobx'
import InteractiveContainer from '../InteractiveContainer'
import CusButton from '../CusButton'
import { Icon } from '@iconify/react'
import Collapse from '@/components/Collapse'

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
          setTimeout(() => {
            store.page.addPage({
              type: 'info',
              name: 'info',
              connection
            })
            setCollapse(true)
          }, 200)
        } catch {}
      }
    }
  }, [connection, store.connection, store.page])

  const onItemClickTh = useThrottleFn(openConnection, {
    wait: 300
  })

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
    <div className={'box-border select-none'}>
      <InteractiveContainer
        className={'flex justify-between text-lg px-2  py-1'}
      >
        <div
          className={'flex overflow-hidden flex-1 items-center'}
          onClick={onTrigger}
        >
          <span className="text-sm mr-1 ">{icon}</span>
          <div className="truncate flex-1" onDoubleClick={onItemClickTh.run}>
            {connection.name}
          </div>
        </div>
        <div className={'flex-shrink-0 pl-2 flex'}>
          {connection.err !== undefined && (
            <Tooltip title={connection.err} color="volcano">
              <WarningOutlined className="text-red-600"></WarningOutlined>
            </Tooltip>
          )}
          {connection.open === true && (
            <>
              <Tooltip title={t('Refresh')}>
                <CusButton
                  icon={<ReloadOutlined></ReloadOutlined>}
                  onClick={(e) => {
                    store.connection.getInfo(connection).then()
                    e.stopPropagation()
                  }}
                ></CusButton>
              </Tooltip>
              <Tooltip title={t('Terminal')}>
                <CusButton
                  onClick={() => {
                    store.page.addPage({
                      type: 'terminal',
                      name: 'terminal',
                      connection
                    })
                  }}
                  icon={<Icon fontSize={18} icon="mynaui:terminal" />}
                ></CusButton>
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
      <Collapse
        collapse={collapse}
        defaultHeight={0}
        className={'overflow-hidden'}
      >
        {children}
      </Collapse>
    </div>
  )
}
export default observer(Connection)
