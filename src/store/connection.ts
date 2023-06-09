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

  update(id: number, data: Partial<APP.Connection>) {
    const index = this.connections.findIndex(v => v.id === id)
    if (index > -1) {
      this.connections = [...this.connections]
      this.connections[index] = {
        ...this.connections[index],
        ...data
      }
    }
  }

  remove(id: number) {
    const index = this.connections.findIndex(v => v.id === id)
    if (index > -1) {
      this.connections.splice(index, 1)
      this.connections = [...this.connections]
    }
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
