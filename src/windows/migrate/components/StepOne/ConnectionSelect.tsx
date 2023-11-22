import React from 'react'

import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { Descriptions, Form } from 'antd'
import useConnectionOption from '@/hooks/useConnectionOption'
import useStore from '@/hooks/useStore'
import { computed } from 'mobx'
import { type FormInstance } from 'antd/es/form/Form'
import { type MigrateItem } from '../../reducer'
import useDatabaseOption from '@/hooks/useDatabaseOption'
import FormSelectItem from '@/components/Form/FormSelectItem'

const ConnectionSelect: React.FC<{
  title: string
  form: FormInstance<MigrateItem>
  readonlyDisabled: boolean
}> = ({ title, form, readonlyDisabled = true }) => {
  const connectionOptions = useConnectionOption(readonlyDisabled)

  const store = useStore()

  const { t } = useTranslation()

  const [connection, setConnection] = React.useState<APP.Connection>()

  const required = computed(() => {
    if (connection === undefined) {
      return true
    }
    if (!connection.is_cluster) {
      return true
    }
    return false
  })

  React.useEffect(() => {
    form.resetFields(['database'])
  }, [connection, form])

  const databasesOption = useDatabaseOption(connection)

  return (
    <div className="flex-1 px-10 py-2 flex-shrink-0 overflow-hidden">
      <div className="text-lg mb-4">{title}</div>
      <div>
        <Form layout="vertical" form={form}>
          <FormSelectItem
            required
            label="Connection"
            name="connection_id"
            inputProps={{
              loading: connection?.loading,
              options: connectionOptions,
              async onChange(id) {
                const conn = store.connection.connections.find(
                  (v) => v.id === id
                )
                if (conn !== undefined) {
                  setConnection(conn)
                  if (conn.open !== true) {
                    try {
                      await store.connection.open(conn.id)
                    } catch (e) {}
                  }
                }
              }
            }}
          />
          <FormSelectItem
            tooltip="Cluster mode is no need"
            label="Database"
            name="database"
            required={required.get()}
            inputProps={{
              options: databasesOption,
              disabled: databasesOption.length === 0
            }}
          />
        </Form>
      </div>
      {connection != null && (
        <div className="mt-10">
          <div className="pb-2 text-blue-600 text-md">{t('Information')}</div>
          <Descriptions
            size="small"
            column={1}
            items={[
              {
                label: t('Name'),
                key: 'name',
                children: <span className="break-all">{connection.name}</span>
              },
              {
                label: t('Host'),
                key: 'host',
                children: <span className="break-all">{connection.host}</span>
              },
              {
                label: t('Port'),
                key: 'port',
                children: <span className="break-all">{connection.port}</span>
              },
              {
                label: t('Server Version'),
                key: 'version',
                children: (
                  <span className="break-all">{connection.version}</span>
                )
              }
            ]}
          ></Descriptions>
        </div>
      )}
    </div>
  )
}
export default observer(ConnectionSelect)
