import { makeAutoObservable } from 'mobx'

export interface DB {
  db: number
  connection: APP.Connection
}

class DBStore {
  db: DB | null = null
  constructor() {
    makeAutoObservable(this)
  }

  set(conn: APP.Connection, db: number) {
    this.db = {
      db,
      connection: conn
    }
  }
}
export default DBStore
