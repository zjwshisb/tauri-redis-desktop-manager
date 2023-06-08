import ConnectionStore from './connection'
import PageStore from './page'
import DBStore from './db'
import React from 'react'
import FieldView from './fieldview'
import SettingStore from './setting'

class Store {
  connection: ConnectionStore
  page: PageStore
  db: DBStore
  fieldView: FieldView
  setting: SettingStore

  constructor() {
    this.connection = new ConnectionStore()
    this.page = new PageStore()
    this.db = new DBStore()
    this.fieldView = new FieldView()
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
}

const store = new Store()
const storeContext = React.createContext(store)
export { store, storeContext }
