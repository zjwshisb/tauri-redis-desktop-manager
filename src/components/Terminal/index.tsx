import React from 'react'
import { type TerminalRow } from './Row'
import Row from './Row'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { MacScrollbar } from 'mac-scrollbar'

const Index: React.FC<{
  rows: TerminalRow[]
  onClear: () => void
  className?: string
}> = ({ rows, onClear, className }) => {
  const container = React.useRef<HTMLDivElement>(null)

  const [filter, setFilter] = React.useState('')

  React.useLayoutEffect(() => {
    if (container.current != null) {
      container.current.scrollTop = container.current.scrollHeight
    }
  }, [rows])

  const { t } = useTranslation()

  const items = React.useMemo(() => {
    let r = rows
    if (filter !== '') {
      r = rows.filter((v) => {
        if (v.message.includes(filter)) {
          return true
        }
        if (v.tags !== undefined) {
          for (const tag of v.tags) {
            if (tag.includes(filter)) {
              return true
            }
          }
        }
        return false
      })
    }
    return r
  }, [filter, rows])

  return (
    <div className={classNames(['flex flex-col', className])}>
      <div
        className={classNames([
          'flex  flex-1 rounded py-1  bg-slate-100 overflow-hidden flex-col'
        ])}
      >
        <MacScrollbar ref={container}>
          <div>
            {items.map((v) => {
              return <Row item={v} key={v.id}></Row>
            })}
          </div>
        </MacScrollbar>
      </div>
      <div className="flex py-2">
        <div className="w-[200px]">
          <Input
            placeholder="filter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
            }}
          ></Input>
        </div>
        <Button onClick={onClear} className="ml-2">
          {t('Clear')}
        </Button>
      </div>
    </div>
  )
}
export type { TerminalRow }
export default Index
