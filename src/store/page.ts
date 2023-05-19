import { makeAutoObservable } from 'mobx'
import type React from 'react'

export interface Page {
  label: string
  children: React.ReactNode
  key: string
}

class PageStore {
  pages: Page[] = []
  active: string = ''
  constructor () {
    makeAutoObservable(this)
  }

  switch (active: string) {
    this.active = active
  }

  removePage (key: string) {
    const index = this.pages.findIndex(v => v.key === key)
    if (index > -1) {
      this.pages.splice(index, 1)
    }
  }

  addPage (page: Page) {
    const exist = this.pages.find(v => v.key === page.key)
    if (exist != null) {
      this.active = exist.key
    } else {
      this.pages.push(page)
      this.active = page.key
    }
  }
}
export default PageStore
