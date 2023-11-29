import { makeAutoObservable } from 'mobx'
import type React from 'react'
import spark from 'spark-md5'
import { openWindow } from '@/utils'
import window from './window'

export type Page =
  | MonitorPage
  | InfoPage
  | KeyPage
  | ClientPage
  | PubsubPage
  | NodePage
  | SlowLogPage
  | ConfigPage
  | MemoryAnalysisPage
  | TerminalPage
  | CollectionPage

interface BasePage<T> {
  label: React.ReactNode
  pageKey: string
  connection?: APP.Connection
  type: T
  name: string
  db?: number
}

type PubsubPage = BasePage<'pubsub'>
type ClientPage = BasePage<'client'>
type NodePage = BasePage<'node'>

type MonitorPage = BasePage<'monitor'>
type InfoPage = BasePage<'info'>
type KeyPage = BasePage<'key'>
type SlowLogPage = BasePage<'slow-log'>
type ConfigPage = BasePage<'config'>
type MemoryAnalysisPage = BasePage<'memory-analysis'>
type TerminalPage = BasePage<'terminal'>
type CollectionPage = BasePage<'collection'>

type CreatePageProps = Omit<Page, 'pageKey' | 'label'>

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

  removeByConnectionId(id: number) {
    this.pages = this.pages.filter((v) => {
      return v.connection?.id !== id
    })
  }

  removeAllPage() {
    this.pages = []
    this.active = ''
  }

  removeLeftPage(index: number) {
    this.pages.splice(0, index)
  }

  removeRightPage(index: number) {
    this.pages.splice(index + 1)
  }

  removePage(key: string) {
    const index = this.pages.findIndex((v) => v.pageKey === key)
    if (index > -1) {
      this.pages.splice(index, 1)
      if (key === this.active) {
        if (this.pages.length >= index + 1) {
          this.active = this.pages[index].pageKey
        } else if (this.pages.length > 0) {
          this.active = this.pages[this.pages.length - 1].pageKey
        }
      }
    }
  }

  getPageByKey(p: string) {
    return this.pages.find((v) => v.pageKey === p)
  }

  async openPageInNewWindowByKey(key: string) {
    const page = this.getPageByKey(key)
    if (page != null) {
      await this.openPageInNewWindow(page)
      this.removePage(key)
    } else {
      return await Promise.reject(new Error('Page Not Found'))
    }
  }

  async openPageInNewWindow(p: Page) {
    let url = ''
    if (p.connection !== undefined) {
      url = `/src/windows/detail/index.html?type=${p.type}&cid=${
        p.connection?.id
      }&key=${encodeURI(p.pageKey)}`
    } else {
      url = `/src/windows/detail/index.html?type=${p.type}&key=${encodeURI(
        p.pageKey
      )}`
    }

    switch (p.type) {
      case 'key': {
        url += `&db=${p.db as number}&name=${encodeURI(p.name)}`
        break
      }
      case 'monitor': {
        break
      }
      case 'pubsub': {
        break
      }
      case 'memory-analysis': {
        break
      }
      case 'info': {
        break
      }
      case 'client': {
        break
      }
      case 'node': {
        break
      }
      case 'slow-log': {
        break
      }
      case 'config': {
        break
      }
      case 'terminal': {
        break
      }
      case 'collection': {
        break
      }
      default: {
        url = ''
        break
      }
    }
    if (url !== '') {
      let label = `${spark.hash(p.pageKey)}`
      if (p.connection != null) {
        label = `${p.connection.id}-${label}`
      }
      await openWindow(label, {
        url,
        title: p.label as string,
        focus: true
      })
    } else {
      return await Promise.reject(new Error('invalid page'))
    }
  }

  getPageKey(
    name: string,
    type: Page['type'],
    conn?: APP.Connection,
    db?: number
  ) {
    let key = `${name}|${type}`
    if (conn != null) {
      key = `${conn.id}|` + key
    }
    if (db !== undefined && type === 'key') {
      key += `@${db}`
    }
    return key
  }

  getPageLabel(page: Omit<Page, 'label'>) {
    let label = `${page.name}`
    if (page.connection !== undefined) {
      label = `${page.connection.id}|${label}`
    }
    if (page.db != null) {
      label += `@${page.db}`
    }
    return label
  }

  addPageOrInNewWindow(props: CreatePageProps) {
    const page = this.createPage(props)
    if (window.isMultiWindow()) {
      this.addPage(page)
    } else {
      this.openPageInNewWindow(page)
    }
  }

  updatePage(key: string, page: Page) {
    const index = this.pages.findIndex((v) => v.pageKey === key)
    if (index > -1) {
      this.pages[index] = page
      if (this.active === key) {
        this.active = page.pageKey
      }
    }
  }

  createPage(props: CreatePageProps): Page {
    const pageKey = this.getPageKey(
      props.name,
      props.type,
      props.connection,
      props.db
    )
    const p = {
      ...props,
      pageKey
    }
    return {
      ...p,
      pageKey,
      label: this.getPageLabel(p)
    }
  }

  addExistsPage(p: Page) {
    this.pages.push(p)
  }

  addPage(props: CreatePageProps) {
    const page = this.createPage(props)
    const exist = this.getPageByKey(page.pageKey)
    if (exist != null) {
      this.active = exist.pageKey
    } else {
      this.pages.push(page)
      this.active = page.pageKey
    }
  }
}
const obj = new PageStore()
export { PageStore }
export default obj
