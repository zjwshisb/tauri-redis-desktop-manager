import { invoke } from '@tauri-apps/api/core'
import { isObject, isString } from 'lodash'
import  {emit} from '@tauri-apps/api/event'
import {ERROR_NOTIFICATION} from '@/consts/event'

export interface Response<T> {
  data: T
}
export interface RequestOptions {
  showNotice: boolean
}
export default async function request<T = any>(
  path: string,
  cid: number = 0,
  args: Record<string, any> | string = {},
  option: RequestOptions = {
    showNotice: true
  }
): Promise<Response<T>> {
  try {
    Object.keys(args).forEach((v) => {
      if (isObject(args)) {
        if (isString(args[v]) && args[v] === '') {
          args[v] = null
        }
      }
    })
    const params = {
      path,
      cid,
      payload: JSON.stringify(args)
    }
    const res = await invoke('dispatch', params)
    const data = JSON.parse(res as string)
    return data as Response<T>
  } catch (err) {
    if (option.showNotice) {
      emit(ERROR_NOTIFICATION, {
        message: err as string
      }).then()
    }
    console.log(path, args, err)
    throw err
  }
}
