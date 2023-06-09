import dayjs from 'dayjs'
import { type TypeFormat } from '.'
import React from 'react'

const item: TypeFormat = {
  key: 'datetime',
  label: 'datetime',
  component: (content) => {
    return <div>{content}</div>
  },
  format(content: string) {
    const time = parseFloat(content)
    let d
    if (time > 100000000000) {
      // milliseconds
      d = dayjs(time)
    } else {
      // seconds
      d = dayjs.unix(time)
    }
    return d.format('YYYY-MM-DDTHH:mm:ssZ[Z]')
  }
}

export default item
