import { openWindow } from '@/utils'
import { makeAutoObservable } from 'mobx'

export interface KeyInfo {
  db: number
  connection: APP.Connection
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

  set(conn: APP.Connection, db: number = 0) {
    this.info = {
      db,
      connection: conn
    }
  }

  newWindow(connection: APP.Connection, db: number = 0) {
    openWindow(`${connection.id}-${db}`, {
      url: `src/windows/database/index.html?cid=${connection.id}&db=${db}`,
      title: `${connection.name}@${db}`
    })
  }
}
const obj = new KeysStore()
export { KeysStore }
export default obj
