import { Modal } from 'antd'
import React from 'react'
import useStore from '../../hooks/useStore'
import { observer } from 'mobx-react-lite'
import ReactJson from 'react-json-view'
import lodash from 'lodash'

const Index: React.FC = () => {
  const store = useStore()

  const isJson: false | object = React.useMemo(() => {
    try {
      const content = store.fieldView.args?.content
      if (content !== undefined) {
        if (lodash.isNumber(content)) {
          return false
        }
        return JSON.parse(content)
      }
    } catch {
      return false
    }
  }, [store.fieldView.args?.content])

  React.useEffect(() => {
    console.log(isJson)
  }, [isJson])

  return (
    <Modal
      width={'800px'}
      bodyStyle={{
        overflow: 'auto',
        overflowY: 'auto',
        height: 800
      }}
      footer={false}
      title={store.fieldView.args?.title}
      open={store.fieldView.active}
      onCancel={() => {
        store.fieldView.hidden()
      }}
    >
      {isJson !== false && (
        <ReactJson
          name={null}
          src={isJson}
          collapsed={false}
          collapseStringsAfterLength={false}
        ></ReactJson>
      )}
    </Modal>
  )
}
export default observer(Index)
