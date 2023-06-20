import React from 'react'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import { Tabs, Dropdown, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const Index: React.FC = () => {
  const store = useStore()

  const { t } = useTranslation()

  return (
    <div
      className={
        'flex-1 h-screen bg-white p-2 pb-20 box-border overflow-x-hidden'
      }
    >
      {store.page.pages.length === 0 && (
        <div className="w-full h-full flex items-center justify-center">
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
                    items: [
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
  )
}

export default observer(Index)
