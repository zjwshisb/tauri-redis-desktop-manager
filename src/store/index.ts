import ConnectionStoreObj, { type ConnectionStore } from './connection'
import PageStoreObj, { type PageStore } from './page'
import KeysStoreObj, { type KeysStore } from './key'
import React from 'react'
import SettingStoreObj, { type SettingStore } from './setting'
class Store {
  connection: ConnectionStore
  page: PageStore
  keyInfo: KeysStore
  setting: SettingStore

  constructor() {
    this.connection = ConnectionStoreObj
    this.page = PageStoreObj
    this.keyInfo = KeysStoreObj
    this.setting = SettingStoreObj
  }
}

const store = new Store()
const storeContext = React.createContext(store)
export { store, storeContext }
