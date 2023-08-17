import ConnectionStore from './connection'
import PageStore from './page'
import KeyInfo from './key'
import React from 'react'
import SettingStore from './setting'
import request from '@/utils/request'
class Store {
  connection: ConnectionStore
  page: PageStore
  keyInfo: KeyInfo
  setting: SettingStore

  constructor() {
    this.connection = new ConnectionStore()
    this.page = new PageStore()
    this.keyInfo = new KeyInfo()
    this.setting = new SettingStore()
  }

  closeConnection(id: number) {
    this.connection.close(id)
    request('connections/close', id).then(() => {
      const pages = this.page.pages.filter(v => {
        return v.connection.id !== id
      })
      this.page.setPage(pages)
      if (this.keyInfo.info?.connection.id === id) {
        this.keyInfo.info = null
      }
    })
  }

  removeConnection(id: number) {
    this.closeConnection(id)
    this.connection.remove(id)
  }
}

const store = new Store()
const storeContext = React.createContext(store)
export { store, storeContext }
