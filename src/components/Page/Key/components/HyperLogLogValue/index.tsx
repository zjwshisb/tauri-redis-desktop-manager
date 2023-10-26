import ValueLayout from '../ValueLayout'
import Add from './comonents/Add'
import Count from './comonents/Count'
import React from 'react'

const HyperLogLogValue: React.FC<{
  keys: APP.HyperLogLogKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  return (
    <ValueLayout
      readonlyAction={
        <>
          <Count keys={keys} />
        </>
      }
      actions={
        <>
          <Add keys={keys} onSuccess={onRefresh}></Add>
        </>
      }
    ></ValueLayout>
  )
}
export default HyperLogLogValue
