import React from 'react'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import { Tabs, Dropdown, type TabsProps, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import { MacScrollbar } from 'mac-scrollbar'
import StickyBox from 'react-sticky-box'
import { computed } from 'mobx'
import { KeyOutlined } from '@ant-design/icons'
import Welcome from './components/Welcome'

const Index: React.FC = () => {
  const store = useStore()

  const { t } = useTranslation()

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
        label: t('Close All Tabs'),
        key: 'all'
      },
      {
        label: t('Close Other Tabs'),
        key: 'other'
      },
      {
        label: t('Close Left Tabs'),
        key: 'left'
      },
      {
        label: t('Close Right Tabs'),
        key: 'right'
      }
    ]
  }, [t])

  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <StickyBox offsetTop={0} offsetBottom={20} style={{ zIndex: 1 }}>
      <DefaultTabBar {...props} style={{ background: '#ECECEC', margin: 0 }} />
    </StickyBox>
  )

  const items = computed(() =>
    store.page.pages.map((v, index) => {
      return {
        label: (
          <Dropdown
            trigger={['contextMenu']}
            menu={{
              onClick(e) {
                switch (e.key) {
                  case 'window': {
                    store.page.openNewWindowPage(v).then(() => {
                      store.page.removePage(v.key)
                    })
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
            <div className="max-w-[200px] truncate hover:context-menu">
              {v.type === 'key' && <KeyOutlined className="!mr-0" />}
              {v.label}
            </div>
          </Dropdown>
        ),
        key: v.key,
        children: v.children
      }
    })
  )

  return (
    <div className={'flex flex-1  bg-white box-border overflow-hidden'}>
      <MacScrollbar
        className="w-full  bg-white"
        style={{ zIndex: 9 }}
        id={'container'}
      >
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                cardGutter: 0,
                cardBg: '#ECECEC'
              }
            }
          }}
        >
          <div className="pb-8 flex-1 h-full">
            {store.page.pages.length === 0 && <Welcome />}
            {store.page.pages.length > 0 && (
              <Tabs
                style={{
                  paddingTop: 0
                }}
                renderTabBar={renderTabBar}
                size="small"
                className=""
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
                items={items.get()}
              />
            )}
          </div>
        </ConfigProvider>
      </MacScrollbar>
    </div>
  )
}

export default observer(Index)
