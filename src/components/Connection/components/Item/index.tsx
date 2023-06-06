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
import DBItem from './DBItem'
import ConnectionMenu from './ConnectionMenu'
import InfoIcon from './Info'
import ClientIcon from './Client'
import { useTranslation } from 'react-i18next'

export interface DBType {
  db: number
  count: number
}

const Index: React.FC<{
  connection: APP.Connection
  onDeleteClick: (conn: APP.Connection) => void
  onConnectionChange?: (conn: APP.Connection) => void
}> = ({ connection, onDeleteClick }) => {
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
        setCollapse(true)
        store.connection.open(connection.id)
      })
    }
  }, [connection.id, getDbs, isOpen, store.connection])

  const onItemClickTh = useThrottleFn(onItemClick, {
    wait: 500
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
        onClick={onItemClickTh.run}
      >
        <div className={'flex overflow-hidden'}>
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
          {databases.map((item, index) => {
            const active = store.db.db.findIndex((v) => {
              return v.connection.id === connection.id && v.db === item.db
            })
            return (
              <DBItem
                db={item}
                connection={connection}
                active={active > -1}
                key={index}
              ></DBItem>
            )
          })}
        </Spin>
      </div>
    </div>
  )
}
export default observer(Index)
