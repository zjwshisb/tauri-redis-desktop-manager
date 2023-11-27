import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputItem from '@/components/Form/FormInputItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormSelectItem from '@/components/Form/FormSelectItem'
import { Form } from 'antd'

const commands: APP.Command[] = [
  {
    label: 'RENAME',
    value: 'RENAME',
    url: 'https://redis.io/commands/rename/'
  },
  {
    label: 'RENAMENX',
    value: 'RENAMENX',
    url: 'https://redis.io/commands/renamenx/'
  }
]

const NameForm: React.FC<{
  keys: APP.Key
  trigger: React.ReactElement
  onSuccess: (name: string) => void
}> = (props) => {
  const [command, setCommand] = React.useState<APP.Command>()

  return (
    <ModalForm
      width={600}
      defaultValue={{
        name: props.keys.name,
        command: 'RENAME'
      }}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('key/rename', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess(v.new_name)
      }}
      documentUrl={command?.url}
      title={command?.label}
    >
      <FormSelectItem
        required
        name={'command'}
        label="Command"
        inputProps={{
          options: commands
        }}
      />
      <BaseKeyForm>
        <Form.Item noStyle dependencies={['command']}>
          {(e) => {
            setCommand(
              commands.find((v) => v.value === e.getFieldValue('command'))
            )
            return <FormInputItem name="new_name" label="New Key" required />
          }}
        </Form.Item>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default NameForm
