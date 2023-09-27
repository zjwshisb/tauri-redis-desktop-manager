import { useDebounceFn } from 'ahooks'
import { Table, type TableProps } from 'antd'
import React from 'react'

export default function CusTable<T extends object>(
  props: TableProps<T> & {
    onLoadMore?: () => Promise<any>
    more?: boolean
    showIndex?: boolean
  }
) {
  const { columns, ...others } = props

  const container = React.useRef<HTMLDivElement>(null)

  // a state for rerender table width
  const [, setRerender] = React.useState(false)

  const table = React.useRef<HTMLDivElement>(null)

  const db = useDebounceFn(
    () => {
      setRerender((p) => !p)
    },
    {
      wait: 100
    }
  )

  React.useEffect(() => {
    window.addEventListener('resize', db.run)
    table.current?.scrollTo({
      top: 100000
    })
    return () => {
      window.removeEventListener('resize', db.run)
    }
  }, [db.run])
  return (
    <div ref={container}>
      <Table
        ref={table}
        virtual
        size="small"
        className="flex justify-center"
        pagination={false}
        footer={(v) => {
          return <div className="flex justify-end">total: {v.length}</div>
        }}
        bordered
        scroll={{
          y: 600,
          x: container.current != null ? container.current.clientWidth - 1 : 0
        }}
        columns={columns}
        {...others}
      ></Table>
    </div>
  )
}
