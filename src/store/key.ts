import { makeAutoObservable } from 'mobx'

export interface KeyInfo {
  db: number
  connection: APP.Connection
  node?: string
}

class KeysStore {
  info: KeyInfo | null = null
  constructor() {
    makeAutoObservable(this)
  }

  remove(cid: number) {
    if (this.info?.connection.id === cid) {
      this.info = null
    }
  }

  set(conn: APP.Connection, db: number = 0, node?: string) {
    this.info = {
      db,
      node,
      connection: conn
    }
  }
}
const obj = new KeysStore()
export { KeysStore }
export default obj
