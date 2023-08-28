import dayjs from 'dayjs'
import { type TypeFormat } from '.'
import React from 'react'
import Error from '../Err'

const item: TypeFormat = {
  key: 'datetime',
  label: 'Datetime',
  render: async (content) => {
    return await new Promise((resolve) => {
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
        resolve(d.format('YYYY-MM-DDTHH:mm:ssZ[Z]'))
        return
      }
      resolve(<Error message="invalid Datetime" />)
    })
  }
}

export default item
