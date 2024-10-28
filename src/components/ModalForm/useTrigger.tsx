import React from 'react'
import { isString } from 'lodash'
import CusButton from '@/components/CusButton'


export function useTrigger(trigger?: React.ReactElement|string, title?: React.ReactNode){
  return React.useMemo(() => {
    if (trigger !== undefined) {
      if (isString(trigger)) {
        return <CusButton>{trigger}</CusButton>
      }
      return trigger
    } else {
      if (isString(title)) {
        return <CusButton>{title}</CusButton>
      }
    }
    return <></>
  }, [title, trigger])
}