import { makeAutoObservable } from 'mobx'
import type React from 'react'
import { WebviewWindow } from '@tauri-apps/api/window'
import { message } from 'antd'

export type Page = MonitorPage | InfoPage | KeyPage | ClientPage | PubsubPage

interface BasePage {
  label: React.ReactNode
  key: string
  children: React.ReactNode
  connection: APP.Connection
}

type PubsubPage = BasePage & {
  type: 'pubsub'
  channels: string[]
  db: number
}
type ClientPage = BasePage & {
  type: 'client'
}
type MonitorPage = BasePage & {
  type: 'monitor'
  file: boolean
}
type InfoPage = BasePage & {
  type: 'info'
}
type KeyPage = BasePage & {
  type: 'key'
  name: string
  db: number
}

class PageStore {
  pages: Page[] = []
  active: string = ''
  constructor() {
    makeAutoObservable(this)
  }

  switch(active: string) {
    this.active = active
  }

  removeOtherPage(index: number) {
    if (index < this.pages.length) {
      this.pages = [this.pages[index]]
    }
  }

  removeAllPage() {
    this.pages = []
    this.active = ''
  }

  removeLeftPage(index: number) {
    this.pages = this.pages.slice(index)
  }

  removeRightPage(index: number) {
    this.pages.splice(index + 1)
    this.pages = [...this.pages]
  }

  removePage(key: string) {
    const index = this.pages.findIndex((v) => v.key === key)
    if (index > -1) {
      this.pages.splice(index, 1)
      this.pages = [...this.pages]
      if (key === this.active) {
        if (this.pages.length >= index + 1) {
          this.active = this.pages[index].key
        } else if (this.pages.length > 0) {
          this.active = this.pages[this.pages.length - 1].key
        }
      }
    }
  }

  setPage(pages: Page[]) {
    this.pages = pages
  }

  openNewWindowPage(p: Page) {
    let url = `/src/windows/detail/index.html?type=${p.type}&cid=${p.connection.id}`
    switch (p.type) {
      case 'key': {
        url += `&db=${p.db}&key=${encodeURI(p.key)}&name=${encodeURI(p.name)}`
        break
      }
      case 'info': {
        break
      }
      case 'monitor': {
        url += `&file=${p.file ? 1 : 0}`
        break
      }
      case 'client': {
        break
      }
      case 'pubsub': {
        url += `&db=${p.db}&channels=${p.channels.join(',')}`
        break
      }
      default: {
        url = ''
        break
      }
    }
    if (url !== '') {
      const webview = new WebviewWindow('test', {
        url,
        title: p.key,
        focus: true
      })
      webview.once('tauri://created', (e) => {
          this.removePage(p.key)
      })
      webview.once('tauri://error', (e) => {
        message.error(e.payload as string)
      })
    }
  }

  updatePage(key: string, page: Page) {
    const index = this.pages.findIndex((v) => v.key === key)
    if (index > -1) {
      this.pages[index] = page
      this.pages = [...this.pages]
      if (this.active === key) {
        this.active = page.key
      }
    }
  }

  addPage(page: Page) {
    const exist = this.pages.find((v) => v.key === page.key)
    if (exist != null) {
      this.active = exist.key
    } else {
      this.pages.push(page)
      this.active = page.key
      this.pages = [...this.pages]
    }
  }
}
export default PageStore
