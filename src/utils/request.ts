/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { invoke } from '@tauri-apps/api/tauri'
import { notification } from 'antd'
import { isObject, isString } from 'lodash'

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
    console.log(path, args, data)
    return data as Response<T>
  } catch (err) {
    if (option.showNotice) {
      notification.error({
        message: err as string,
        duration: 3
      })
    }
    console.log(path, args, err)
    throw err
  }
}
