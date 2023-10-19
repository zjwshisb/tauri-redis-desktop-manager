import { useDebounceFn } from 'ahooks'
import { Table, type TableProps } from 'antd'
import React from 'react'

export default function CusTable<T extends object>(
  props: TableProps<T> & {
    onLoadMore?: () => Promise<any>
    more?: boolean
    showIndex?: boolean
    showFooter?: boolean
  }
) {
  const { columns, virtual = true, showFooter = true, ...others } = props

  const container = React.useRef<HTMLDivElement>(null)

  const [scrollX, setScrollX] = React.useState<number>(1000)

  const table = React.useRef<HTMLDivElement>(null)

  const db = useDebounceFn(
    () => {
      if (container.current !== null) {
        setScrollX(container.current?.clientWidth - 1)
      }
    },
    {
      wait: 100
    }
  )
  React.useEffect(() => {
    db.run()
  }, [db])

  React.useEffect(() => {
    window.addEventListener('resize', db.run)
    return () => {
      window.removeEventListener('resize', db.run)
    }
  }, [db.run])

  const scroll = React.useMemo(() => {
    if (virtual) {
      return {
        y: 600,
        x: scrollX
      }
    }
    return undefined
  }, [scrollX, virtual])

  const footer = React.useMemo(() => {
    if (!showFooter) {
      return undefined
    }
    const footerRender = (v: readonly T[]) => {
      return <div className="flex justify-end">total: {v.length}</div>
    }
    return footerRender
  }, [showFooter])

  return (
    <div ref={container}>
      <Table
        ref={table}
        virtual={virtual}
        size="small"
        className="w-full"
        pagination={false}
        footer={footer}
        bordered
        scroll={scroll}
        columns={columns}
        {...others}
      ></Table>
    </div>
  )
}
