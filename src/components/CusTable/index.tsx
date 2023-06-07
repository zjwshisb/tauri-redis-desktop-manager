import { Table, type TableProps } from 'antd'
import React from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { type ColumnsType } from 'antd/es/table'

export function formatColumns<T>(c: ColumnsType<T>) {
  const n = [...c]
  n.unshift({
    title: '#',
    render(_, __, index) {
      return index + 1
    }
  })
  n.forEach((v) => {
    if (v.align === undefined) {
      v.align = 'center'
    }
  })
  return n
}

export default function CusTable<T extends object>(
  props: TableProps<T> & {
    onLoadMore?: () => void
    more?: boolean
  }
) {
  const { t } = useTranslation()

  const { columns, ...others } = props

  return (
    <div>
      <Table
        pagination={false}
        scroll={{
          x: 'auto'
        }}
        columns={columns !== undefined ? formatColumns<T>(columns) : undefined}
        {...others}
      ></Table>
      {others.more !== undefined && (
        <Button
          disabled={!others.more}
          block
          className="my-4"
          onClick={() => {
            if (others.onLoadMore !== undefined) {
              others.onLoadMore()
            }
          }}
        >
          {t('Load More')}
        </Button>
      )}
    </div>
  )
}
