import { invoke } from '@tauri-apps/api/tauri'
import { message } from 'antd'

export interface Response<T> {
  data: T
}
export default async function request<T> (path: string, args: Record<string, any> = {}): Promise<Response<T>> {
  console.log({
    path,
    ...args
  })
  return await invoke('dispatch', {
    path,
    payload: JSON.stringify(args)
  }).then(res => {
    const data = JSON.parse(res as string)
    console.log(data)
    return data as Response<T>
  }).catch(async err => {
    message.error(err)
    return await Promise.reject(err)
  })
};
