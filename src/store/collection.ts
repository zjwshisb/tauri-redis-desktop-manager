import { makeAutoObservable } from 'mobx'
import pageObj from './page'
import { listen, emit } from '@tauri-apps/api/event'
import request from '@/utils/request'

const COLLECTION_CHANGE = 'collection_change'

class CollectionStore {
  public items: APP.Collection[]
  constructor() {
    this.items = []
    makeAutoObservable(this)
    this.getAll()
    listen(COLLECTION_CHANGE, () => {
      this.getAll()
    }).then()
  }

  getAll() {
    request<APP.Collection[]>('collections').then((res) => {
      this.items = res.data
    })
  }

  removeByPageKey(key: string) {
    const index = this.items.findIndex((v) => v.key === key)
    if (index > -1) {
      const i = this.items.splice(index, 1)
      request('collections/del', 0, {
        id: i[0].id
      }).then(() => {
        emit(COLLECTION_CHANGE).then()
      })
    }
  }

  addByPageKey(key: string) {
    const page = pageObj.getPageByKey(key)
    if (page != null) {
      request<APP.Collection>('collections/add', 0, {
        name: page.name,
        types: page.type,
        connection_id: page.connection != null ? page.connection.id : 0,
        key,
        db: page.db
      }).then(() => {
        emit(COLLECTION_CHANGE).then()
      })
    }
  }

  isCollected(key: string) {
    return this.items.findIndex((v) => v.key === key) > -1
  }
}
const obj = new CollectionStore()
export default obj
export { CollectionStore }
