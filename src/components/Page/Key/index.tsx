import React from 'react'
import { Input } from 'antd'
import styles from './index.module.less'
import StringValue from './components/StringValue'
import HashValue from './components/HashValue'

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
        <div className={styles.info}>
            <Input addonBefore={item.types} value={item.name} readOnly className={styles.item}></Input>
                <Input addonBefore={'ttl'} value={item.ttl} readOnly className={styles.item}></Input>
            </div>
        <div className={styles.content}>
            {v}
         </div>
    </div>
}

export default Index
