import type React from 'react'
import datetime from './datetime'
import text from './text'
import json from './json'

export interface TypeFormat {
  key: 'datetime' | 'json' | 'text'
  label: string
  render: (content: string) => Promise<React.ReactNode>
}

const items: Record<string, TypeFormat> = {}
items[datetime.key] = datetime
items[text.key] = text
items[json.key] = json

export default items
