import ConnectionStore from './connection'
import PageStore from './page'
import DBStore from './db'
import React from 'react'
import FieldView from './fieldview'

class Store {
  connection: ConnectionStore
  page: PageStore
  db: DBStore
  fieldView: FieldView

  constructor () {
    this.connection = new ConnectionStore()
    this.page = new PageStore()
    this.db = new DBStore()
    this.fieldView = new FieldView()
  }
}

const store = new Store()
const storeContext = React.createContext(store)
export { store, storeContext }
