import { makeAutoObservable } from 'mobx'
import request from '../utils/request'
class ConnectionStore {
  connections: APP.Connection[] = []
  openIds: Record<number, boolean> = {}

  constructor() {
    makeAutoObservable(this)
  }

  async open(id: number) {
    this.openIds = { ...this.openIds }
    this.openIds[id] = true
  }

  async close(id: number) {
    this.openIds = { ...this.openIds }
    this.openIds[id] = false
  }

  isOpen(id: number) {
    return this.openIds[id]
  }

  async fetchConnections() {
    this.connections = (
      await request<APP.Connection[]>('connections/get', 0)
    ).data
  }
}
export default ConnectionStore
