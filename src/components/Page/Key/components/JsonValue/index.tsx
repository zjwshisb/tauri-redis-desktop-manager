import React from 'react'
import { Button, Card, Form } from 'antd'

import ValueLayout from '../ValueLayout'
import lodash from 'lodash'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'
import FieldInput from '@/components/InputJson'
import JsonView from '@/components/JsonView'

const JsonValue: React.FC<{
  keys: APP.JsonKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
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
    return <JsonView src={value.value}></JsonView>
  }, [value.json, value.value])

  return (
    <ValueLayout
      actions={
        <ModalForm
          width={800}
          onSubmit={async (v) => {
            await request('json/set', keys.connection_id, {
              db: keys.db,
              path: '$',
              name: keys.name,
              value: v.value
            }).then(() => {
              onRefresh()
            })
          }}
          defaultValue={{ value: formatValue }}
          title={t('Edit')}
          trigger={<Button type="primary">{t('Edit')}</Button>}
        >
          <Form.Item name={'value'}>
            <FieldInput />
          </Form.Item>
        </ModalForm>
      }
    >
      <Card bodyStyle={{ padding: 8 }}>{children}</Card>
    </ValueLayout>
  )
}
export default JsonValue
