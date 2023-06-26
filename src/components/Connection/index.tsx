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
import ConnectionMenu from './components/Menu'
import InfoIcon from './components/Info'
import ClientIcon from './components/Client'
import { useTranslation } from 'react-i18next'
import Info from '@/components/Page/Info'
import Monitor from './components/Monitor'
import { getPageKey } from '@/utils'

export interface DBType {
  db: number
  count: number
}

const Index: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const store = useStore()

  const [collapse, setCollapse] = React.useState(false)
  const [databases, setDatabases] = React.useState<DBType[]>([])

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
      const dbs: DBType[] = []
      for (let i = 0; i < parseInt(res.data); i++) {
        dbs.push({
          db: i,
          count: 0
        })
      }
      setDatabases(dbs)
      setLoading(false)
    } catch (e) {
      setLoading(false)
      throw e
    }
  }, [connection.id])

  const onItemClick = React.useCallback(() => {
    if (isOpen) {
      setCollapse((p) => !p)
    } else {
      getDbs().then(() => {
        store.connection.open(connection.id)
        const key = getPageKey('info', connection)
        store.page.addPage({
          label: key,
          key,
          children: <Info connection={connection}></Info>,
          connectionId: connection.id
        })
        setCollapse(true)
      })
    }
  }, [connection, getDbs, isOpen, store.connection, store.page])

  const onItemClickTh = useThrottleFn(onItemClick, {
    wait: 300
  })

  const height = React.useMemo(() => {
    if (isOpen && collapse) {
      return (22 * databases.length).toString() + 'px'
    } else {
      return 0
    }
  }, [collapse, databases, isOpen])

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

                <InfoIcon connection={connection} />
                <ClientIcon connection={connection} />
                <Monitor connection={connection} />
              </>
            )}

            <ConnectionMenu connection={connection} />
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
          {databases.map((item) => {
            const active =
              store.db.db?.connection.id === connection.id &&
              store.db.db?.db === item.db
            return (
              <DBItem
                db={item}
                connection={connection}
                active={active}
                key={item.db}
              ></DBItem>
            )
          })}
        </Spin>
      </div>
    </div>
  )
}
export default observer(Index)
