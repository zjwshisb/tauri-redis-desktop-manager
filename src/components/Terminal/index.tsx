import React from 'react'
import { type TerminalRow } from './Row'
import Row from './Row'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { MacScrollbar } from 'mac-scrollbar'

const Index: React.FC<{
  rows: TerminalRow[]
  onClear: () => void
  className?: string
}> = ({ rows, onClear, className }) => {
  const container = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    if (container.current != null) {
      container.current.scrollTop = container.current.scrollHeight
    }
  }, [rows])

  const { t } = useTranslation()

  return (
    <div className={classNames(['flex flex-col p-1', className])}>
      <div
        className={classNames([
          'flex bg-[#002B36] flex-1 rounded  overflow-hidden flex-col'
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
      <div className="py-2 h-[100px]">
        <Button onClick={onClear}>{t('Clear')}</Button>
      </div>
    </div>
  )
}
export type { TerminalRow }
export default Index
