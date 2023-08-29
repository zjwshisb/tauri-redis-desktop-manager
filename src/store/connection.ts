import { makeAutoObservable, runInAction } from 'mobx'
import request from '../utils/request'
import { getAll } from '@tauri-apps/api/window'
import { Modal } from 'antd'
import pageStore from './page'
import keysStore from './key'
interface Form {
  open: boolean
  item?: APP.Connection
}

class ConnectionStore {
  connections: APP.Connection[] = []
  form: Form = {
    open: false,
    item: undefined
  }

  constructor() {
    makeAutoObservable(this)
    this.fetchConnections()
  }

  openForm(connection?: APP.Connection) {
    if (connection !== undefined && connection.open === true) {
      Modal.confirm({
        title: 'Notice',
        content: 'You must close the connection before editing',
        onOk: () => {
          this.close(connection.id)
          this.form = {
            open: true,
            item: connection
          }
        }
      })
    } else {
      this.form = {
        open: true,
        item: connection
      }
    }
  }

  getForm() {
    return this.form
  }

  closeForm() {
    this.form = {
      open: false
    }
  }

  async open(id: number) {
    const connection = this.connections.find((v) => v.id === id)
    if (connection !== undefined) {
      await request('connections/open', connection.id)
      if (connection.is_cluster) {
        const nodes = await request<APP.Node[]>('cluster/nodes', connection.id)
        runInAction(() => {
          connection.nodes = nodes.data.filter((v) => {
            return v.flags.includes('master')
          })
        })
      } else {
        const db = await request<string>('config/databases', connection.id)
        const count = parseInt(db.data)
        const dbs: number[] = []
        for (let i = 0; i < count; i++) {
          dbs.push(i)
        }
        runInAction(() => {
          connection.dbs = dbs
        })
      }
      const version = await request<string>('server/version', connection.id)
      runInAction(() => {
        connection.version = version.data
        connection.open = true
      })
    }
  }

  async close(id: number) {
    const connection = this.connections.find((v) => v.id === id)
    if (connection != null) {
      await request('connections/close', id)
      runInAction(() => {
        connection.open = false
        connection.dbs = undefined
        connection.version = undefined
        connection.nodes = undefined
        pageStore.removeByConnectionId(id)
        keysStore.remove(id)
        const allWindow = getAll()
        for (const x of allWindow) {
          const index = x.label.indexOf('-')
          if (index > -1) {
            const webviewId = x.label.substring(0, index)
            if (id.toString() === webviewId) {
              x.close()
            }
          }
        }
      })
    }
  }

  update(id: number, data: Partial<APP.Connection>) {
    const index = this.connections.findIndex((v) => v.id === id)
    if (index > -1) {
      this.connections[index] = {
        ...this.connections[index],
        ...data
      }
    }
  }

  add(connection: APP.Connection) {
    this.connections.push(connection)
  }

  remove(id: number) {
    const index = this.connections.findIndex((v) => v.id === id)
    if (index > -1) {
      this.close(this.connections[index].id)
      this.connections.splice(index, 1)
    }
  }

  async fetchConnections() {
    const res = await request<APP.Connection[]>('connections/get', 0)
    runInAction(() => {
      this.connections = res.data
    })
  }
}
const obj = new ConnectionStore()
export { ConnectionStore }
export default obj
