import { Row } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'

const FieldForm: React.FC<{
  keys: APP.HashKey
  field?: APP.Field
  trigger: React.ReactElement
  onSuccess: () => void
}> = (props) => {
  const { t } = useTranslation()

  const isEdit = React.useMemo(() => {
    return props.field !== undefined
  }, [props.field])

  const defaultValue = React.useMemo(() => {
    if (props.field != null) {
      return {
        value: [
          {
            ...props.field
          }
        ]
      }
    } else {
      return {
        value: [
          {
            field: undefined,
            value: undefined
          }
        ]
      }
    }
  }, [props.field])

  return (
    <ModalForm
      title={'HSET'}
      documentUrl="https://redis.io/commands/hset/"
      width={800}
      defaultValue={defaultValue}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('key/hash/hset', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          ...v
        }).then(() => {
          props.onSuccess()
        })
      }}
    >
      <FormListItem
        name="value"
        label=""
        showAdd={props.field === undefined}
        renderItem={(field) => {
          return (
            <Row gutter={20}>
              <FormInputItem
                span={8}
                name={[field.name, 'field']}
                label={t('Field Name')}
                required
                inputProps={{
                  readOnly: isEdit
                }}
              />
              <FormInputJsonItem
                span={16}
                name={[field.name, 'value']}
                label={t('Field Value')}
                required
              />
            </Row>
          )
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default FieldForm
