import React from 'react'
import { type TerminalRow } from './Row'
import Row from './Row'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

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
    <div>
      <div
        className={classNames([
          'bg-[#002B36] overflow-y-auto p-2 rounded',
          className
        ])}
        ref={container}
      >
        {rows.map((v) => {
          return <Row item={v} key={v.id}></Row>
        })}
      </div>
      <div className="py-2">
        <Button onClick={onClear}>{t('Clear')}</Button>
      </div>
    </div>
  )
}

export default Index
