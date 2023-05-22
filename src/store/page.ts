import { makeAutoObservable } from 'mobx'
import type React from 'react'

export interface Page {
  label: string
  key: string
  children: React.ReactNode
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
