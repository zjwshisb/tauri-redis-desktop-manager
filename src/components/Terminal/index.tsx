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
  search?: string
  onSearchChange?: (v: string) => void
}> = ({ rows, onClear, className, search, onSearchChange }) => {
  const container = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    if (container.current != null) {
      container.current.scrollTop = container.current.scrollHeight
    }
  }, [rows])

  const { t } = useTranslation()

  return (
    <div className={classNames(['flex flex-col', className])}>
      <div
        className={classNames([
          'flex  flex-1 rounded py-1  bg-slate-100 overflow-hidden flex-col'
        ])}
      >
        <MacScrollbar ref={container}>
          <div>
            {rows.map((v) => {
              return <Row item={v} key={v.id}></Row>
            })}
          </div>
        </MacScrollbar>
      </div>
      <div className="flex py-2">
        {onSearchChange != null && (
          <div className="w-[200px]">
            <Input
              placeholder="filter"
              value={search}
              onChange={(e) => {
                if (onSearchChange !== undefined) {
                  onSearchChange(e.target.value)
                }
              }}
            ></Input>
          </div>
        )}

        <Button onClick={onClear} className="ml-2">
          {t('Clear')}
        </Button>
      </div>
    </div>
  )
}
export type { TerminalRow }
export default Index
