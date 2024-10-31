import { makeAutoObservable, runInAction } from 'mobx'
import request from '../utils/request'
import { getAllWebviewWindows } from '@tauri-apps/api/webviewWindow'
import pageStore from './page'
import keysStore from './key'
import collectionStore from './collection'
import { versionCompare } from '@/utils'

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
    this.fetchConnections().then()
  }

  openForm(connection?: APP.Connection) {
    this.form = {
      open: true,
      item: connection
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

  async getInfo(connection: APP.Connection) {
    connection.loading = true
    try {
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
        const dbs: APP.Database[] = []
        for (let i = 0; i < count; i++) {
          const db = {
            database: i,
            count: 0
          }
          const res = await request<number>('db/dbsize', connection.id, {
            db: db.database
          })
          db.count = res.data
          dbs.push(db)
        }
        runInAction(() => {
          connection.dbs = dbs
        })
      }
      const version = await request<string>('server/version', connection.id)
      if (versionCompare(version.data, '4.0.0') >= 0) {
        const modules = await request<APP.Module[]>(
          'server/module',
          connection.id
        )
        runInAction(() => {
          connection.modules = modules.data
        })
      }
      runInAction(() => {
        connection.version = version.data
        connection.open = true
        connection.loading = false
      })
    } catch (e) {
      runInAction(() => {
        connection.loading = false
        connection.open = false
        connection.err = e as string
      })
    }
  }

  async open(id: number) {
    const connection = this.getById(id)
    if (connection !== undefined) {
      try {
        connection.loading = true
        await request('connections/open', connection.id)
        runInAction(() => {
          if (connection.err !== undefined) {
            connection.err = undefined
          }
          connection.loading = false
        })
        return await this.getInfo(connection)
      } catch (err) {
        runInAction(() => {
          connection.loading = false
          connection.err = err as string
        })
        throw err
      }
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
        getAllWebviewWindows().then((allWindow) => {
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
      })
    }
  }

  getById(id: number) {
    return this.connections.find((v) => v.id === id)
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

  async remove(id: number) {
    const index = this.connections.findIndex((v) => v.id === id)
    if (index > -1) {
      await request('connections/del', 0, {
        id
      })
      runInAction(() => {
        this.close(this.connections[index].id)
        this.connections.splice(index, 1)
        collectionStore.getAll()
      })
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
