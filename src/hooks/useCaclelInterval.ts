import { useInterval, useUnmount } from 'ahooks'

export default function useCancelInterval(
  fn: () => void,
  delay?: number,
  options?: {
    immediate?: boolean
  }
) {
  const cancel = useInterval(fn, delay, options)
  useUnmount(() => {
    cancel()
  })
}
