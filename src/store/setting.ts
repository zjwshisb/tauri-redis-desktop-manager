import { makeAutoObservable } from 'mobx'
import i18n from '@/i18n'

const SETTING_CACHE_KEY = 'SETTING_CACHE_KEY'

export interface AppSetting {
  locale: string
  key_count: number
  field_count: number
}

class SettingStore {
  setting: AppSetting = {
    locale: i18n.language,
    key_count: 100,
    field_count: 100
  }

  constructor() {
    const cache = localStorage.getItem(SETTING_CACHE_KEY)
    if (cache !== null) {
      try {
        const setting: AppSetting = JSON.parse(cache)
        this.setting = setting
        i18n.changeLanguage(this.setting.locale)
      } catch {
      }
    }
    makeAutoObservable(this)
  }

  update(data: Partial<AppSetting>) {
    if (data.locale !== undefined) {
        this.setting.locale = data.locale
        i18n.changeLanguage(this.setting.locale)
    }
    this.setting = {
      ...this.setting,
      ...data
    }
    localStorage.setItem(SETTING_CACHE_KEY, JSON.stringify(this.setting))
  }
}
export default SettingStore
