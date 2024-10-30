import React from 'react'

import { isReadonly } from '@/components/Editable'
import connectionContext from '../../context'
import { Button, Space, Spin } from 'antd'
import { Icon } from '@iconify/react'
import Collapse from '@/components/Collapse'

const toolbarDefaultHeight = 38

const ValueLayout: React.FC<
  React.PropsWithChildren<{
    actions?: React.ReactNode
    readonlyAction?: React.ReactNode
    loading?: boolean
    header?: React.ReactNode
  }>
> = ({ actions, children, header, readonlyAction, loading = false }) => {
  const connection = React.useContext(connectionContext)

  const containerRef = React.useRef<HTMLDivElement>(null)

  const [open, setOpen] = React.useState(false)

  const [showMore, setShowMore] = React.useState(true)

  const icon = React.useMemo(() => {
    if (open) {
      return (
        <Icon
          icon={'mingcute:left-line'}
          fontSize={18}
          className="-rotate-90 transition-all"
        ></Icon>
      )
    } else {
      return (
        <Icon
          fontSize={18}
          icon={'mingcute:left-line'}
          className="transition-all"
        ></Icon>
      )
    }
  }, [open])

  const toolbar = React.useMemo(() => {
    if (actions !== undefined || readonlyAction !== undefined) {
      return (
        <Collapse
          collapse={open}
          defaultHeight={toolbarDefaultHeight}
          onHeightChange={(b) => {
            setShowMore(b)
          }}
        >
          <div className={'mb-2 pr-6'}>
            <Space wrap={true} ref={containerRef}>
              {readonlyAction}
              {!isReadonly(connection) && actions}
            </Space>
            {showMore && (
              <div className={'cursor-pointer absolute right-0 top-1'}>
                <Button
                  type={'link'}
                  size={'small'}
                  icon={icon}
                  onClick={() => {
                    setOpen((p) => !p)
                  }}
                ></Button>
              </div>
            )}
          </div>
        </Collapse>
      )
    }
    return <></>
  }, [actions, connection, icon, open, readonlyAction, showMore])

  return (
    <Spin spinning={loading}>
      {header !== undefined && <div className="mb-2">{header}</div>}
      {toolbar}
      <div>{children}</div>
    </Spin>
  )
}
export default ValueLayout
