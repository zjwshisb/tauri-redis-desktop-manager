import { makeAutoObservable } from 'mobx'

class WindowStore {
  name: string = ''

  constructor() {
    makeAutoObservable(this)
  }

  setName(name: string) {
    this.name = name
  }

  isMultiWindow() {
    return this.name === 'main' || this.name === 'database'
  }
}
const obj = new WindowStore()
export { WindowStore }
export default obj
