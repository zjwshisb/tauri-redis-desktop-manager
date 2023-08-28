import { Table, type TableProps } from 'antd'
import React from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { PlusOutlined } from '@ant-design/icons'

export default function CusTable<T extends object>(
  props: TableProps<T> & {
    onLoadMore?: () => Promise<any>
    more?: boolean
    showIndex?: boolean
  }
) {
  const { t } = useTranslation()

  const { columns, ...others } = props

  return (
    <div>
      <Table
        size="small"
        pagination={false}
        bordered
        scroll={{
          x: 'auto'
        }}
        columns={columns}
        {...others}
      ></Table>
      {others.more !== undefined && (
        <Button
          loading={others.loading}
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
