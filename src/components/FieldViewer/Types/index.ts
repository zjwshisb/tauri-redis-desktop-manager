import type React from 'react'
import datetime from './datetime'
import text from './text'
import json from './json'
import phpunserialize from './phpunserialize'

export interface TypeFormat {
  key: 'datetime' | 'json' | 'text' | 'php_unserialize'
  label: string
  render: (content: string) => Promise<React.ReactNode>
}

const items: Record<string, TypeFormat> = {}
items[datetime.key] = datetime
items[text.key] = text
items[json.key] = json
items[phpunserialize.key] = phpunserialize

export default items
