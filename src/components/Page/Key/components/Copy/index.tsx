import CusButton from '@/components/CusButton'
import FormInputItem from '@/components/Form/FormInputItem'
import FormSelectItem from '@/components/Form/FormSelectItem'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import { CopyOutlined } from '@ant-design/icons'
import connectionContext from '../../context'
import React from 'react'
import useDatabaseOption from '@/hooks/useDatabaseOption'
import FormCheckBoxItem from '@/components/Form/FormCheckBoxItem'
import VersionAccess from '@/components/VersionAccess'
import useStore from '@/hooks/useStore'
import Editable from '@/components/Editable'
import { observer } from 'mobx-react-lite'

const Copy: React.FC<{
  keys: APP.Key
}> = ({ keys }) => {
  const connection = React.useContext(connectionContext)

  const dbOptions = useDatabaseOption(connection)

  const store = useStore()

  const isCluster = React.useMemo(() => {
    return connection?.is_cluster === true
  }, [connection?.is_cluster])

  return (
    <Editable connection={connection}>
      <VersionAccess version="6.2.0" connection={connection}>
        <ModalForm
          documentUrl="https://redis.io/commands/copy/"
          width={600}
          defaultValue={{
            source: keys.name,
            destination_db: isCluster ? 0 : undefined,
            replace: false
          }}
          trigger={<CusButton type="default" icon={<CopyOutlined />} />}
          title="COPY"
          onSubmit={async (v) => {
            const res = await request<number>('key/copy', keys.connection_id, {
              ...v,
              db: keys.db
            })
            if (res.data === 1) {
              store.page.addPage({
                type: 'key',
                name: v.destination,
                db: v.destination_db === undefined ? keys.db : v.destination_db,
                connection
              })
            }
          }}
        >
          <FormInputItem required label="Source" name="source" />
          <FormInputItem required label="Destination" name="destination" />
          {!isCluster && (
            <FormSelectItem
              label="Destination DB"
              name="destination_db"
              inputProps={{
                options: dbOptions
              }}
            />
          )}
          <FormCheckBoxItem label="Replace" name="replace" />
        </ModalForm>
      </VersionAccess>
    </Editable>
  )
}
export default observer(Copy)
