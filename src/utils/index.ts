import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { WebviewLabel, WebviewOptions } from '@tauri-apps/api/webview'
import { store } from '@/store'
import { Window } from '@tauri-apps/api/window'
import { Webview } from '@tauri-apps/api/webview'
import _ from 'lodash'

export function versionCompare(v1: string, v2: string) {
  const sources = v1.split('.')
  const target = v2.split('.')
  const maxL = Math.max(sources.length, target.length)
  let result = 0
  for (let i = 0; i < maxL; i++) {
    const preValue = sources.length > i ? sources[i] : '0'
    const preNum = parseInt(preValue)
    const lastValue = target.length > i ? target[i] : '0'
    const lastNum = parseInt(lastValue)
    if (preNum < lastNum) {
      result = -1
      break
    } else if (preNum > lastNum) {
      result = 1
      break
    }
  }
  return result
}

export async function openWindow(
  label: WebviewLabel,
  title: string,
  options: Partial<WebviewOptions>
): Promise<Window> {
  const { width = 1000, height = 800, x = 0, y = 0, ...other } = options

  const window = new Window(label, {
    title
  })

  return await new Promise((resolve, reject) => {
    const webview = new Webview(window, label, {
      width,
      height,
      x,
      y,
      ...other
    })
    webview.once('tauri://created', function () {
      resolve(window)
    })
    webview.once('tauri://error', function (e) {
      window.setFocus()
      reject(e)
    })
  })
}

export function memoryFormat(memory: number) {
  if (memory <= 1024) {
    return `${memory}B`
  }
  if (memory <= 1024 * 1024) {
    return (memory / 1024).toFixed(1) + 'KB'
  }
  return (memory / 1024 / 1024).toFixed(1) + 'MB'
}

export function isMainWindow() {
  const window = getCurrentWebviewWindow()
  return window.label === 'main'
}
