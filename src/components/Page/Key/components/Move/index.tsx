import CusButton from '@/components/CusButton'
import FormSelectItem from '@/components/Form/FormSelectItem'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import { SwapOutlined } from '@ant-design/icons'
import connectionContext from '../../context'
import React from 'react'
import useDatabaseOption from '@/hooks/useDatabaseOption'

import useStore from '@/hooks/useStore'
import { observer } from 'mobx-react-lite'
import Editable from '@/components/Editable'
import BaseKeyForm from '../BaseKeyForm'

const Move: React.FC<{
  keys: APP.Key
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const connection = React.useContext(connectionContext)

  const dbOptions = useDatabaseOption(connection)

  const store = useStore()

  if (connection?.is_cluster === true) {
    return <></>
  }

  return (
    <Editable connection={connection}>
      <ModalForm
        defaultValue={{
          name: keys.name
        }}
        documentUrl="https://redis.io/commands/move/"
        width={600}
        trigger={<CusButton type="default" icon={<SwapOutlined />} />}
        title="MOVE"
        onSubmit={async (v) => {
          const res = await request<number>('key/move', keys.connection_id, {
            ...v,
            db: keys.db
          })
          if (res.data === 1) {
            onSuccess()
            store.page.addPage({
              type: 'key',
              name: v.name,
              db: v.value,
              connection
            })
          }
        }}
      >
        <BaseKeyForm>
          <FormSelectItem
            label="DB"
            name="value"
            required
            inputProps={{
              options: dbOptions
            }}
          />
        </BaseKeyForm>
      </ModalForm>
    </Editable>
  )
}
export default observer(Move)
