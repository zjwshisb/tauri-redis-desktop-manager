import { useDebounceFn } from 'ahooks'
import { Table, type TableColumnType, type TableProps } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { isString } from 'lodash'

export default function CusTable<T extends object>(
  props: TableProps<T> & {
    onLoadMore?: () => Promise<any>
    more?: boolean
    showFooter?: boolean
    action?: TableColumnType<T>
    readonly?: boolean
    addIndex?: boolean
  }
) {
  const {
    columns,
    virtual = true,
    showFooter = true,
    action,
    readonly = false,
    addIndex = false,
    ...others
  } = props

  const container = React.useRef<HTMLDivElement>(null)

  const [scrollX, setScrollX] = React.useState<number>(1000)

  const { t } = useTranslation()

  const newColumns: TableProps<T>['columns'] = React.useMemo(() => {
    let cols: TableProps<T>['columns'] = []
    if (columns !== undefined) {
      cols = [...columns]
    }
    if (addIndex) {
      cols.unshift({
        title: '#',
        width: 100,
        render(_, __, index) {
          return index
        }
      })
    }
    if (action != null && !readonly) {
      const newAction: TableColumnType<T> = {
        title: 'Action',
        fixed: 'right',
        ...action
      }
      cols.push(newAction)
    }
    cols.forEach((v) => {
      if (isString(v.title) && v.title !== '') {
        v.title = t(v.title)
      }
      if (v.align === undefined) {
        v.align = 'center'
      }
    })
    return cols
  }, [action, addIndex, columns, readonly, t])

  const getScrollX = useDebounceFn(
    () => {
      if (container.current !== null) {
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
    getScrollX.run()
  }, [getScrollX])

  React.useLayoutEffect(() => {
    const div = container.current
    if (div !== null) {
      const observer = new ResizeObserver((entries) => {
        getScrollX.run()
      })
      observer.observe(div)
      return () => {
        observer.unobserve(div)
      }
    }
  }, [getScrollX])

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
        columns={newColumns}
        {...others}
      ></Table>
    </div>
  )
}
