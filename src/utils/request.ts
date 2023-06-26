import { invoke } from '@tauri-apps/api/tauri'
import { message } from 'antd'

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
    console.log(params)
    const data = JSON.parse(res as string)
    return data as Response<T>
  } catch (err) {
    message.error(err as string)
    throw err
  }
}
