import { invoke } from '@tauri-apps/api/tauri'
import { notification } from 'antd'

export interface Response<T> {
  data: T
}
export default async function request<T>(
  path: string,
  cid: number | null = 0,
  args: Record<string, any> = {}
): Promise<Response<T>> {
  try {
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
    notification.error({
      message: err as string,
      duration: 3
    })
    console.log(err)
    throw err
  }
}
