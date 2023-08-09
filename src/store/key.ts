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

  set(conn: APP.Connection, db: number = 0, node?: string) {
    this.info = {
      db,
      node,
      connection: conn
    }
  }
}
export default KeysStore
