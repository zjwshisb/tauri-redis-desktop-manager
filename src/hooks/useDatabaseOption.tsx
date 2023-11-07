import React from 'react'
import { type DefaultOptionType } from 'antd/es/select'
import { computed } from 'mobx'
import { KeyOutlined } from '@ant-design/icons'

export default function useDatabaseOption(
  connection?: APP.Connection
): DefaultOptionType[] {
  return computed(() => {
    if (connection === undefined) {
      return []
    }
    if (connection.is_cluster) {
      return []
    }
    if (connection.dbs === undefined) {
      return []
    }
    return connection.dbs.map((v) => {
      return {
        label: (
          <span className="flex items-center">
            {v.database}({v.count}
            <KeyOutlined className="text-sm"></KeyOutlined>)
          </span>
        ),
        value: v.database
      }
    })
  }).get()
}
