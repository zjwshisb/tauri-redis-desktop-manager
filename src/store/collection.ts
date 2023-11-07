import { makeAutoObservable, runInAction } from 'mobx'
import pageObj from './page'
import request from '@/utils/request'

class CollectionStore {
  public items: APP.Collection[]
  constructor() {
    this.items = []
    this.getAll()
    makeAutoObservable(this)
  }

  getAll() {
    request<APP.Collection[]>('collections').then((res) => {
      runInAction(() => {
        this.items = res.data
      })
    })
  }

  removeByPageKey(key: string) {
    const index = this.items.findIndex((v) => v.key === key)
    if (index > -1) {
      const i = this.items.splice(index, 1)
      console.log(i[0].id)
      request('collections/del', 0, {
        id: i[0].id
      }).then(() => {})
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
      }).then((res) => {
        runInAction(() => {
          this.items.unshift(res.data)
        })
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
