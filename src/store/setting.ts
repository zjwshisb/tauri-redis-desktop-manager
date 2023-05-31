import { makeAutoObservable } from 'mobx'
import i18n from '@/i18n'
class SettingStore {
  locale: string
  key_count: number
  field_count: number
  constructor() {
    this.locale = i18n.language
    this.key_count = 100
    this.field_count = 100
    makeAutoObservable(this)
  }

  update(data: Record<string, any>) {
    if (data.locale !== undefined) {
        this.locale = data.locale
        i18n.changeLanguage(this.locale)
    }
    this.key_count = data.key_count
    this.field_count = data.field_count
  }
}
export default SettingStore
