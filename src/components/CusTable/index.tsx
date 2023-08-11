import { Table, type TableProps } from 'antd'
import React from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { type ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'

export function formatColumns<T>(c: ColumnsType<T>, showIndex: boolean) {
  const n = [...c]
  if (showIndex) {
    n.unshift({
      title: '#',
      width: 100,
      render(_, __, index) {
        return index + 1
      }
    })
  }

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
    showIndex?: boolean
  }
) {
  const { t } = useTranslation()

  const { columns, showIndex = true, ...others } = props

  return (
    <div>
      <Table
        pagination={false}
        bordered
        scroll={{
          x: 'auto'
        }}
        columns={
          columns !== undefined
            ? formatColumns<T>(columns, showIndex)
            : undefined
        }
        {...others}
      ></Table>
      {others.more !== undefined && (
        <Button
          disabled={!others.more}
          icon={<PlusOutlined />}
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
