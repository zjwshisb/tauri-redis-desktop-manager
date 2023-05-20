import React from 'react'
import { Button, Input } from 'antd'
import StringValue from './components/StringValue'
import HashValue from './components/HashValue'
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import Copy from '@/components/Copy'

const Index: React.FC<{
  item: APP.Key
}> = ({ item }) => {
  const v = React.useMemo(() => {
    switch (item.types) {
      case 'string': {
        return <StringValue item={item} />
      }
      case 'hash': {
        return <HashValue item={item} />
      }
    }
    return <></>
  }, [item])

  return <div>
        <div className={'flex pb-4'}>
          <div className='w-[300px]'>
            <Input addonBefore={item.types} value={item.name} readOnly
            addonAfter={
              <Copy content={item.name} />
            }
            ></Input>
          </div>
          <div className='w-[300px] ml-4'>
            <Input addonBefore={'ttl'} value={item.ttl} readOnly></Input>
          </div>
          <div>
            <Button className='ml-2' icon={
              <ReloadOutlined />
            }>
            </Button>
            <Button className='ml-2' danger type='primary' icon={
              <DeleteOutlined />
            }>
            </Button>
          </div>
        </div>
        <div className={''}>
            {v}
         </div>
    </div>
}

export default Index
