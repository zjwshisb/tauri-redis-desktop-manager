import React from 'react'
import {
  DeleteOutlined,
  SettingOutlined,
  RightOutlined,
  DatabaseOutlined,
  DownOutlined
} from '@ant-design/icons'
import styles from './index.module.less'
import classnames from 'classnames'
import { observer } from 'mobx-react-lite'
import useStore from '../../../../hooks/useStore'
import request from '../../../../utils/request'
import Info from '../../../Page/Info'

const Index: React.FC<{
  connection: APP.Connection
  onDeleteClick: (conn: APP.Connection) => void
  onConnectionChange?: (conn: APP.Connection) => void
}> = ({ connection, onDeleteClick }) => {
  const store = useStore()

  const db = React.useMemo(() => {
    return new Array(16).fill(1)
  }, [])

  const [isOpen, setIsOpen] = React.useState(false)

  return <div className={styles.item}>
        <div className={styles.header} onClick={() => {
          setIsOpen(p => !p)
        }}>
            <div className={styles.info}>
                {
                    isOpen ? <DownOutlined className={styles.icon} /> : <RightOutlined className={styles.icon} />
                }
                <div>
                {connection.host}:{connection.port}
                </div>
            </div>
            <div className={styles.action}>
                <DeleteOutlined className={classnames(styles.icon, styles.big)} onClick={(e) => {
                  e.stopPropagation()
                  onDeleteClick(connection)
                }}
                />
            </div>
        </div>
        <div className={classnames(styles.content, isOpen ? styles.open : null)}>
            <div className={styles.dbItem} onClick={() => {
              request<string>('server/info', {
              }).then((res) => {
                store.page.addPage({
                  label: 'info',
                  key: '1',
                  children: <Info content={res.data}></Info>
                })
              })
            }}>
                <SettingOutlined className={styles.icon}></SettingOutlined>
                <div>info</div>
            </div>
            {
                db.map((v, index) => {
                  const key = connection.host + index.toString()
                  const active = store.db.db.findIndex(v => {
                    return v.connection.id === connection.id && v.db === index
                  })
                  return <div
                    key ={key}
                    onClick={() => {
                      if (active > -1) {
                        store.db.remove(key)
                      } else {
                        store.db.add(connection, index)
                      }
                    }}
                    className={classnames(styles.dbItem, active > -1 ? styles.active : '')}>
                    <DatabaseOutlined className={styles.icon}></DatabaseOutlined>
                    <div>{index}</div>
                </div>
                })
            }
        </div>
    </div>
}
export default observer(Index)
