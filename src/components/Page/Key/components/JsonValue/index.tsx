import React from 'react'
import { Card } from 'antd'

import ValueLayout from '../ValueLayout'
import ReactJson from 'react-json-view'
import lodash from 'lodash'

const JsonValue: React.FC<{
  keys: APP.JsonKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const [isJson, setIsJson] = React.useState(false)

  const value = React.useMemo(() => {
    const v = keys.data.slice(1, keys.data.length - 1)
    const vJson = JSON.parse(v)
    if (lodash.isObject(vJson)) {
      setIsJson(true)
    } else {
      setIsJson(false)
    }
    return vJson
  }, [keys.data])

  React.useEffect(() => {
    console.log(value)
  }, [value])

  return (
    <ValueLayout>
      <Card bodyStyle={{ padding: 8 }}>
        {isJson ? <ReactJson src={value} name={false}></ReactJson> : value}
      </Card>
    </ValueLayout>
  )
}
export default JsonValue
