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
