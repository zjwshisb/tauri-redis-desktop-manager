import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'
import FormInputItem from '@/components/Form/FormInputItem'
import FormTextareaItem from '@/components/Form/FormTextAreaItem'

const Edit: React.FC<{
  connection: APP.Connection
  field: APP.Field
  trigger: React.ReactElement
  onSuccess: (newField: APP.Field) => void
}> = (props) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      defaultValue={{
        ...props.field
      }}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('config/edit', props.connection.id, {
          name: props.field.field,
          value: v.value
        })
        props.onSuccess(v as APP.Field)
      }}
      title={t('Edit Config')}
    >
      <FormInputItem
        name={'field'}
        label="Name"
        required
        inputProps={{
          readOnly: true
        }}
      />
      <FormTextareaItem
        name="value"
        required
        label="Value"
        inputProps={{
          rows: 3
        }}
      />
    </ModalForm>
  )
}
export default Edit
