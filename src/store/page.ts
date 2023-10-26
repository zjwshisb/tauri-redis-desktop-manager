import { makeAutoObservable } from 'mobx'
import type React from 'react'
import spark from 'spark-md5'
import { isMainWindow, openWindow } from '@/utils'

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

interface BasePage<T> {
  label: React.ReactNode
  key: string
  children: React.ReactNode
  connection: APP.Connection
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

type CreatePageProps = Omit<Page, 'key' | 'children' | 'label'>
type RenderChildrenFn = (props: Omit<Page, 'children'>) => React.ReactNode

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
    const index = this.pages.findIndex((v) => v.key === key)
    if (index > -1) {
      this.pages.splice(index, 1)
      if (key === this.active) {
        if (this.pages.length >= index + 1) {
          this.active = this.pages[index].key
        } else if (this.pages.length > 0) {
          this.active = this.pages[this.pages.length - 1].key
        }
      }
    }
  }

  async openNewWindowPageKey(key: string) {
    const page = this.pages.find((v) => v.key === key)
    if (page != null) {
      await this.openNewWindowPage(page)
      this.removePage(key)
    } else {
      return await Promise.reject(new Error('Page Not Found'))
    }
  }

  async openNewWindowPage(p: Page) {
    let url = ''
    if (p.connection !== undefined) {
      url = `/src/windows/detail/index.html?type=${p.type}&cid=${
        p.connection?.id
      }&key=${encodeURI(p.key)}`
    } else {
      url = `/src/windows/detail/index.html?type=${p.type}&key=${encodeURI(
        p.key
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

      default: {
        url = ''
        break
      }
    }
    if (url !== '') {
      const label = `${p.connection.id}-${spark.hash(p.key)}`
      await openWindow(label, {
        url,
        title: p.key,
        focus: true
      })
    } else {
      return await Promise.reject(new Error('invalid page'))
    }
  }

  getPageKey(name: string, conn: APP.Connection, db?: number) {
    let key = `${conn.id}|${name}`
    if (db !== undefined) {
      key += `@${db}`
    }
    return key
  }

  openPage(page: Page) {
    if (isMainWindow()) {
      this.addPage(page)
    } else {
      this.openNewWindowPage(page)
    }
  }

  updatePage(key: string, page: Page) {
    const index = this.pages.findIndex((v) => v.key === key)
    if (index > -1) {
      this.pages[index] = page
      if (this.active === key) {
        this.active = page.key
      }
    }
  }

  createPage(p: CreatePageProps, renderChildren: RenderChildrenFn): Page {
    const key = this.getPageKey(p.name, p.connection, p.db)
    const props = {
      key,
      label: key,
      ...p
    }
    return {
      children: renderChildren(props),
      ...props
    }
  }

  addCreatePage(p: CreatePageProps, render: RenderChildrenFn) {
    const page = this.createPage(p, render)
    this.addPage(page)
  }

  addPage(page: Page) {
    const exist = this.pages.find((v) => v.key === page.key)
    if (exist != null) {
      this.active = exist.key
    } else {
      this.pages.push(page)
      this.active = page.key
    }
  }
}
const obj = new PageStore()
export { PageStore }
export default obj
