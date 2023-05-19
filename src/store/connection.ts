import { makeAutoObservable } from 'mobx'
import request from '../utils/request'
class ConnectionStore {
  connections: APP.Connection[] = []
  constructor () {
    makeAutoObservable(this)
  }

  async fetchConnections () {
    this.connections = (await request<APP.Connection[]>('connections/get')).data
  }
}
export default ConnectionStore
