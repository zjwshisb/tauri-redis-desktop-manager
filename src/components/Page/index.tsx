import React from 'react'
import { Space, Spin, Switch, Tooltip } from 'antd'
import classNames from 'classnames'
import {
  ReloadOutlined,
  StarFilled,
  StarOutlined,
  WindowsOutlined
} from '@ant-design/icons'
import CusButton from '../CusButton'
import useStore from '@/hooks/useStore'
import { observer } from 'mobx-react-lite'
import StickyBox from 'react-sticky-box'
import { useLatest, useLocalStorageState } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { computed } from 'mobx'
import useHasMultiPage from '@/hooks/useHasMultiPage'

interface PageProps {
  pageKey: string
  onRefresh?: () => void
  loading?: boolean
  wFull?: boolean
  collected?: boolean
  className?: string
  noPadding?: boolean
  actionRight?: React.ReactNode
  showAction?: boolean
}

const Collect: React.FC<{
  pageKey: string
}> = observer(({ pageKey }) => {
  const store = useStore()

  const icon = computed(() => {
    if (store.collection.isCollected(pageKey)) {
      return <StarFilled />
    } else {
      return <StarOutlined />
    }
  })

  const onClick = computed(() => {
    return () => {
      if (store.collection.isCollected(pageKey)) {
        store.collection.removeByPageKey(pageKey)
      } else {
        store.collection.addByPageKey(pageKey)
      }
    }
  })

  return (
    <CusButton
      tooltip={{
        title: 'Collection'
      }}
      icon={icon.get()}
      onClick={onClick.get()}
    ></CusButton>
  )
})

const Page: React.FC<React.PropsWithChildren<PageProps>> = (props) => {
  const {
    noPadding = false,
    collected = true,
    pageKey,
    actionRight,
    onRefresh,
    showAction = true
  } = props

  const store = useStore()

  const [autoRefresh, setAutoRefresh] = useLocalStorageState<boolean>(
    'KeyAutoRefresh',
    { defaultValue: false }
  )

  const refreshRef = useLatest(onRefresh)

  React.useEffect(() => {
    if (autoRefresh === true && refreshRef.current !== undefined) {
      const interval = setInterval(() => {
        if (refreshRef.current !== undefined) {
          refreshRef?.current()
        }
      }, 10 * 1000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [autoRefresh, refreshRef])

  const { t } = useTranslation()

  const hasMultiPage = useHasMultiPage()

  const offsetTop = React.useMemo(() => {
    if (hasMultiPage) {
      return 38
    }
    return 0
  }, [hasMultiPage])

  return (
    <Spin
      className="w-full"
      spinning={props.loading === undefined ? false : props.loading}
    >
      {showAction && (
        <StickyBox
          offsetTop={offsetTop}
          offsetBottom={20}
          style={{ zIndex: 2 }}
        >
          <div className="flex justify-between border-b px-3 py-1 bg-white">
            <div>
              <Space>
                {collected && <Collect pageKey={props.pageKey} />}
                {hasMultiPage && (
                  <CusButton
                    icon={<WindowsOutlined />}
                    tooltip={{
                      title: 'Open In New Window'
                    }}
                    onClick={() => {
                      store.page.openPageInNewWindowByKey(pageKey)
                    }}
                  />
                )}

                {onRefresh !== undefined && (
                  <CusButton
                    icon={<ReloadOutlined />}
                    onClick={onRefresh}
                    tooltip={{
                      title: 'Refresh'
                    }}
                  />
                )}
              </Space>
            </div>
            <div>
              <Space>
                {actionRight}
                {refreshRef.current !== undefined && (
                  <Tooltip title={t('Auto Refresh')} placement="left">
                    <Switch
                      size="small"
                      checked={autoRefresh}
                      onChange={(e) => {
                        setAutoRefresh(e)
                      }}
                    ></Switch>
                  </Tooltip>
                )}
              </Space>
            </div>
          </div>
        </StickyBox>
      )}

      <div
        className={classNames([
          !noPadding && 'p-3',
          props.wFull === true && 'w-screen',
          props.className
        ])}
      >
        {props.children}
      </div>
    </Spin>
  )
}
export default observer(Page)
