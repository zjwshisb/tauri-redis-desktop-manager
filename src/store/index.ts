import ConnectionStore from './connection'
import PageStore from './page'
import DBStore from './db'
import React from 'react'
import SettingStore from './setting'

class Store {
  connection: ConnectionStore
  page: PageStore
  db: DBStore
  setting: SettingStore

  constructor() {
    this.connection = new ConnectionStore()
    this.page = new PageStore()
    this.db = new DBStore()
    this.setting = new SettingStore()
  }

  closeConnection(id: number) {
    this.connection.close(id)
    const pages = this.page.pages.filter(v => {
      return v.connectionId !== id
    })
    this.page.setPage(pages)
    if (this.db.db?.connection.id === id) {
      this.db.db = null
    }
  }

  removeConnection(id: number) {
    this.closeConnection(id)
    this.connection.remove(id)
  }
}

const store = new Store()
const storeContext = React.createContext(store)
export { store, storeContext }
