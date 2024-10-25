import { observer } from 'mobx-react-lite'
import { Typography } from 'antd'
import useAppName from '@/hooks/useAppName'
import useAppVersion from '@/hooks/useAppVersion'

const Welcome = () => {
  const name = useAppName()

  const version = useAppVersion()

  return (
    <div className="w-full h-[500px] flex flex-col items-center justify-center">
      <Typography.Title level={3}>{name}</Typography.Title>
      <Typography.Text>v{version}</Typography.Text>
    </div>
  )
}

export default observer(Welcome)
