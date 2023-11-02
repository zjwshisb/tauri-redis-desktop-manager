import { makeAutoObservable } from 'mobx'
import i18n from '@/i18n'
import { emit, listen } from '@tauri-apps/api/event'
import { SETTING_CHANGE } from '@/event'
import { isMainWindow } from '@/utils'

const SETTING_CACHE_KEY = 'SETTING_CACHE_KEY'

export interface AppSetting {
  locale: string
  key_count: number
  field_count: number
  dark_mode: boolean
}

class SettingStore {
  setting: AppSetting = {
    locale: i18n.language,
    key_count: 100,
    field_count: 100,
    dark_mode: false
  }

  constructor() {
    const cache = localStorage.getItem(SETTING_CACHE_KEY)
    if (cache !== null) {
      try {
        const setting: AppSetting = JSON.parse(cache)
        this.update(setting)
      } catch {}
    }
    if (!isMainWindow()) {
      listen<AppSetting>(SETTING_CHANGE, (e) => {
        this.update(e.payload)
      })
    }
    makeAutoObservable(this)
  }

  update(data: Partial<AppSetting>) {
    if (data.locale !== undefined) {
      this.setting.locale = data.locale
      i18n.changeLanguage(this.setting.locale)
    }
    const htmls = document.getElementsByTagName('html')
    if (htmls.length >= 1) {
      const html = htmls[0]
      if (data.dark_mode === true) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }

    this.setting = {
      ...this.setting,
      ...data
    }
    if (isMainWindow()) {
      emit(SETTING_CHANGE, this.setting)
    }
    localStorage.setItem(SETTING_CACHE_KEY, JSON.stringify(this.setting))
  }
}
const obj = new SettingStore()
export { SettingStore }
export default obj
