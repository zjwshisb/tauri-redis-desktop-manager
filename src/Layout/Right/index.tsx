import React from 'react'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import { Tabs, Dropdown, Typography, FloatButton } from 'antd'
import { useTranslation } from 'react-i18next'
import { MacScrollbar } from 'mac-scrollbar'

const Index: React.FC = () => {
  const store = useStore()

  const { t } = useTranslation()

  const ref = React.useRef<HTMLElement>(null)

  const rightMenus = React.useMemo(() => {
    return [
      {
        label: t('Open In New Window'),
        key: 'window'
      },
      {
        label: t('Close'),
        key: 'close'
      },
      {
        label: t('Close All Tags'),
        key: 'all'
      },
      {
        label: t('Close Other Tags'),
        key: 'other'
      },
      {
        label: t('Close Left Tags'),
        key: 'left'
      },
      {
        label: t('Close Right Tags'),
        key: 'right'
      }
    ]
  }, [t])

  return (
    <div className={'flex flex-1 h-screen bg-white box-border overflow-hidden'}>
      <MacScrollbar className="w-full p-4 " ref={ref} id={'container'}>
        <FloatButton.BackTop
          target={() => {
            const target = document.getElementById('container')
            return target as HTMLElement
          }}
        />
        <div className="pb-8 flex-1">
          {store.page.pages.length === 0 && (
            <div className="w-full h-[500px] flex items-center justify-center">
              <Typography.Title>Tauri Redis Desktop Manager</Typography.Title>
            </div>
          )}
          {store.page.pages.length > 0 && (
            <Tabs
              size="small"
              hideAdd
              onEdit={(targetKey, action) => {
                if (action === 'remove') {
                  store.page.removePage(targetKey as string)
                }
              }}
              onTabClick={(e) => {
                store.page.switch(e)
              }}
              type="editable-card"
              activeKey={store.page.active}
              items={store.page.pages.map((v, index) => {
                return {
                  label: (
                    <Dropdown
                      trigger={['contextMenu']}
                      menu={{
                        onClick(e) {
                          switch (e.key) {
                            case 'window': {
                              store.page.openNewWindowPage(v)
                              break
                            }
                            case 'close': {
                              store.page.removePage(v.key)
                              break
                            }
                            case 'all': {
                              store.page.removeAllPage()
                              break
                            }
                            case 'other': {
                              store.page.removeOtherPage(index)
                              break
                            }
                            case 'left': {
                              store.page.removeLeftPage(index)
                              break
                            }
                            case 'right': {
                              store.page.removeRightPage(index)
                              break
                            }
                          }
                        },
                        items: rightMenus
                      }}
                    >
                      <div className="max-w-xs truncate hover:context-menu">
                        {v.label}
                      </div>
                    </Dropdown>
                  ),
                  key: v.key,
                  children: v.children
                }
              })}
            />
          )}
        </div>
      </MacScrollbar>
    </div>
  )
}

export default observer(Index)
