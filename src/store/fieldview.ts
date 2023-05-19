import { makeAutoObservable } from 'mobx'

interface FieldViewArgs {
  title?: string
  content: string
}

class FieldView {
  args: FieldViewArgs | null = null
  active: boolean = false
  constructor () {
    makeAutoObservable(this)
  }

  show (args: FieldViewArgs) {
    this.args = args
    this.active = true
  }

  hidden () {
    this.active = false
  }
}
export default FieldView
