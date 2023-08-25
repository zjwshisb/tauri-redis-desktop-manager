import { type TypeFormat } from '.'
import React from 'react'
import Error from '../Err'
import request from '@/utils/request'

const item: TypeFormat = {
  key: 'phpunseriablize',
  label: 'phpunseriablize',
  render: async (content) => {
    try {
      const res = await request<string>(
        'transfer/php_unserialize',
        0,
        {
          data: content
        },
        { showNotice: false }
      )
      return res.data
    } catch (err) {
      return <Error message={err as string} />
    }
  }
}

export default item
