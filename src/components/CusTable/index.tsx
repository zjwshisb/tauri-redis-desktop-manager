import { useDebounceFn } from 'ahooks'
import { Table, type TableProps } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

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

  const { t } = useTranslation()

  const db = useDebounceFn(
    () => {
      if (container.current !== null) {
        console.log('test')
        let containerWith = container.current?.clientWidth - 1
        if (containerWith <= 800) {
          containerWith = 800
        }
        setScrollX(containerWith)
      }
    },
    {
      wait: 100
    }
  )
  React.useEffect(() => {
    db.run()
  }, [db])

  React.useLayoutEffect(() => {
    const div = container.current
    if (div !== null) {
      const observer = new ResizeObserver((entries) => {
        db.run()
      })
      observer.observe(div)
      return () => {
        observer.unobserve(div)
      }
    }
  }, [db])

  const scroll = React.useMemo(() => {
    if (virtual) {
      return {
        y: 600,
        x: scrollX
      }
    } else {
      return {
        x: 'auto'
      }
    }
  }, [scrollX, virtual])

  const footer = React.useMemo(() => {
    if (!showFooter) {
      return undefined
    }
    const footerRender = (v: readonly T[]) => {
      return (
        <div className="flex justify-end">
          {t('total')}:{v.length}
        </div>
      )
    }
    return footerRender
  }, [showFooter, t])

  return (
    <div ref={container}>
      <Table
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
