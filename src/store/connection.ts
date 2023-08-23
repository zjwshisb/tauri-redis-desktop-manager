import { makeAutoObservable, runInAction } from 'mobx'
import request from '../utils/request'
import { getAll } from '@tauri-apps/api/window'

class ConnectionStore {
  connections: APP.Connection[] = []
  openIds: Record<number, boolean> = {}

  constructor() {
    makeAutoObservable(this)
  }

  async open(id: number) {
    const connection = this.connections.find((v) => v.id === id)
    if (connection != null) {
      await request('connections/open', connection.id)
      if (connection.is_cluster) {
        const res = await request<string[]>('cluster/nodes', connection.id)
        connection.nodes = res.data
      } else {
        const res = await request<string>('config/databases', connection.id)
        const count = parseInt(res.data)
        const dbs: number[] = []
        for (let i = 0; i < count; i++) {
          dbs.push(i)
        }
        connection.dbs = dbs
      }
      const res = await request<string>('server/version', connection.id)
      connection.version = res.data
      this.update(connection.id, connection)
      runInAction(() => {
        this.openIds[id] = true
        this.openIds = { ...this.openIds }
      })
    }
  }

  async close(id: number) {
    this.openIds[id] = false
    this.openIds = { ...this.openIds }
    // close the connection webview
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
  }

  update(id: number, data: Partial<APP.Connection>) {
    const index = this.connections.findIndex((v) => v.id === id)
    if (index > -1) {
      this.connections[index] = {
        ...this.connections[index],
        ...data
      }
      this.connections = [...this.connections]
    }
  }

  remove(id: number) {
    const index = this.connections.findIndex((v) => v.id === id)
    if (index > -1) {
      this.connections.splice(index, 1)
      this.connections = [...this.connections]
    }
  }

  isOpen(id: number) {
    return this.openIds[id]
  }

  async fetchConnections() {
    const res = await request<APP.Connection[]>('connections/get', 0)

    runInAction(() => {
      this.connections = res.data
    })
  }
}
export default ConnectionStore
