import React from 'react'
import { Button, Card } from 'antd'

import ValueLayout from '../ValueLayout'
import ReactJson from 'react-json-view'
import lodash from 'lodash'
import request from '@/utils/request'
import connectionContext from '../../context'
import Editable from '@/components/Editable'
import { useTranslation } from 'react-i18next'
import FieldEditor from '@/components/FieldEditor'

const JsonValue: React.FC<{
  keys: APP.JsonKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const connection = React.useContext(connectionContext)

  const { t } = useTranslation()

  const formatValue = React.useMemo(() => {
    return keys.data.slice(1, keys.data.length - 1)
  }, [keys.data])

  const value = React.useMemo(() => {
    const vJson = JSON.parse(formatValue)
    let isJson = true
    if (!lodash.isObject(vJson)) {
      isJson = false
    }
    return {
      json: isJson,
      value: vJson
    }
  }, [formatValue])

  const children = React.useMemo(() => {
    if (!value.json) {
      return value.value
    }
    return <ReactJson src={value.value} name={false}></ReactJson>
  }, [value.json, value.value])

  return (
    <ValueLayout
      actions={
        <Editable connection={connection}>
          <FieldEditor
            title={t('Edit')}
            trigger={<Button type="primary">{t('Edit')}</Button>}
            defaultValue={formatValue}
            onSubmit={async (v) => {
              await request('json/set', keys.connection_id, {
                db: keys.db,
                path: '$',
                name: keys.name,
                value: v
              }).then(() => {
                onRefresh()
              })
            }}
          ></FieldEditor>
        </Editable>
      }
    >
      <Card bodyStyle={{ padding: 8 }}>{children}</Card>
    </ValueLayout>
  )
}
export default JsonValue
