import React from 'react'

import { DeleteOutlined } from '@ant-design/icons'

import Editable from '@/components/Editable'
import Context from '../../context'
import CusButton from '@/components/CusButton'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'
import request from '@/utils/request'
import FormSelectItem from '@/components/Form/FormSelectItem'

const commands: APP.Command[] = [
  {
    label: 'DEL',
    value: 'DEL',
    url: 'https://redis.io/commands/del/'
  },
  {
    label: 'UNLINK',
    value: 'UNLINK',
    url: 'https://redis.io/commands/unlink/',
    version: '4.0.0'
  }
]

const DelForm: React.FC<{
  keys: APP.Key
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const connection = React.useContext(Context)

  const [command, setCommand] = React.useState<APP.Command>()

  return (
    <Editable connection={connection}>
      <ModalForm
        width={600}
        title={command?.label}
        documentUrl={command?.url}
        onValueChange={(form) => {
          if (Object.keys(form).includes('command')) {
            setCommand(commands.find((v) => v.value === form.command))
          }
        }}
        defaultValue={{
          command: 'DEL',
          name: [keys.name]
        }}
        onSubmit={async (v) => {
          await request('key/del', keys.connection_id, {
            db: keys.db,
            ...v
          })
          onSuccess()
        }}
        trigger={
          <CusButton
            icon={<DeleteOutlined />}
            danger
            type="primary"
          ></CusButton>
        }
      >
        <FormSelectItem
          label="Command"
          name="command"
          required
          inputProps={{
            options: commands
          }}
        ></FormSelectItem>
        <FormListItem
          name="name"
          label="Keys"
          required
          renderItem={(f) => {
            return <FormInputItem {...f} required />
          }}
        />
      </ModalForm>
    </Editable>
  )
}

export default DelForm
