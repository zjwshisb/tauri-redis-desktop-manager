import { makeAutoObservable } from 'mobx'

export interface DB {
  db: number
  connection: APP.Connection
  key: string
}

class DBStore {
  db: DB[] = []
  active = ''
  constructor () {
    makeAutoObservable(this)
  }

  remove (key: string) {
    console.log(key)
    const index = this.db.findIndex(v => {
      return v.key === key
    })
    if (index > -1) {
      this.db.splice(index, 1)
    }
  }

  switch (active: string) {
    this.active = active
  }

  add (conn: APP.Connection, db: number) {
    const key = conn.host + db.toString()
    this.active = key
    const index = this.db.findIndex(v => {
      return v.key === key
    })
    if (index === -1) {
      this.db.push({
        db,
        connection: conn,
        key
      })
    }
  }
}
export default DBStore
