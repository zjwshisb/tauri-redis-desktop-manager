import React from 'react'

import { observer } from 'mobx-react-lite'
import {platform as getPlatform} from '@tauri-apps/plugin-os'
import Normal from './components/Normal'
const TitleBar: React.FC = () => {

  const platform = getPlatform()

  const children = React.useMemo(() =>{
    switch (platform) {
      default:
        return <Normal />
    }
  }, [])

  return (
    <div className="flex justify-between h-9">
      {children}
    </div>
  )
}

export default observer(TitleBar)
