import { invoke } from '@tauri-apps/api/tauri'
import { notification } from 'antd'

export interface Response<T> {
  data: T
}

export interface RequestOptions {
  showNotice: boolean
}
export default async function request<T>(
  path: string,
  cid: number | null = 0,
  args: Record<string, any> = {},
  option: RequestOptions = {
    showNotice: true
  }
): Promise<Response<T>> {
  try {
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
      notification.error({
        message: err as string,
        duration: 3
      })
    }
    console.log(path, args, err)
    throw err
  }
}
