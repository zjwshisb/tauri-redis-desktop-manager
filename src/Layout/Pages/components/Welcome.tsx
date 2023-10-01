import React from 'react'
import { observer } from 'mobx-react-lite'
import { getVersion } from '@tauri-apps/api/app'
import { Typography } from 'antd'

const Welcome = () => {
  const [version, setVersion] = React.useState('')

  React.useEffect(() => {
    getVersion().then((r) => {
      setVersion(r)
    })
  }, [])

  return (
    <div className="w-full h-[500px] flex flex-col items-center justify-center">
      <Typography.Title level={3}>Tauri Redis Desktop Manager</Typography.Title>
      <Typography.Text>v{version}</Typography.Text>
    </div>
  )
}

export default observer(Welcome)
