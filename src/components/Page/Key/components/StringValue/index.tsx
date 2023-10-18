import React from 'react'
import { Button, Card } from 'antd'
import FieldViewer from '@/components/FieldViewer'
import request from '@/utils/request'
import ValueLayout from '../ValueLayout'
import FieldEditor from '@/components/FieldEditor'
import { useTranslation } from 'react-i18next'
import Editable from '@/components/Editable'
import connectionContext from '../../context'

const Index: React.FC<{
  keys: APP.StringKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const [value, setValue] = React.useState(keys.data)

  const connection = React.useContext(connectionContext)

  const { t } = useTranslation()

  React.useEffect(() => {
    setValue(keys.data)
  }, [keys.data])

  return (
    <ValueLayout
      actions={
        <Editable connection={connection}>
          <FieldEditor
            onSubmit={async (value) => {
              return await request('key/set', keys.connection_id, {
                db: keys.db,
                name: keys.name,
                value
              }).then(() => {
                onRefresh()
                return true
              })
            }}
            defaultValue={keys.data}
            title={t('Edit')}
            trigger={<Button type="primary">{t('Edit')}</Button>}
          ></FieldEditor>
        </Editable>
      }
    >
      <Card bodyStyle={{ padding: 8 }}>
        <FieldViewer content={value}></FieldViewer>
      </Card>
    </ValueLayout>
  )
}
export default Index
