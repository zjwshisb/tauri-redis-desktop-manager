import dayjs from 'dayjs'
import { type TypeFormat } from '.'
import React from 'react'
import Error from '../Err'

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
    if (d.isValid()) {
      return d.format('YYYY-MM-DDTHH:mm:ssZ[Z]')
    }
    return <Error message="invalid Datetime" />
  }
}

export default item
