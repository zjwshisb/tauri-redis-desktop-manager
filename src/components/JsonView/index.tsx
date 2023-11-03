import React from 'react'
import ReactJson, { type ReactJsonViewProps } from 'react-json-view'
import useStore from '@/hooks/useStore'
import { observer } from 'mobx-react-lite'

const JsonView: React.FC<Omit<ReactJsonViewProps, 'theme'>> = (p) => {
  const store = useStore()

  const theme = React.useMemo(() => {
    if (store.setting.setting.dark_mode) {
      return 'summerfruit'
    }
    return 'summerfruit:inverted'
  }, [store.setting.setting.dark_mode])

  return (
    <ReactJson
      theme={theme}
      indentWidth={2}
      sortKeys={true}
      collapseStringsAfterLength={200}
      enableClipboard
      name={false}
      quotesOnKeys={false}
      collapsed={1}
      {...p}
    ></ReactJson>
  )
}
export default observer(JsonView)
