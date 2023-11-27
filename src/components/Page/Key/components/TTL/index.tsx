import React, { useContext } from 'react'
import { Input, Select } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import context from '../../context'
import { isReadonly } from '@/components/Editable'
import CusButton from '@/components/CusButton'
import TTLForm from './TTLForm'
import request from '@/utils/request'
import useCommand from '@/hooks/useCommand'
import { observer } from 'mobx-react-lite'

const commands: APP.Command[] = [
  {
    label: 'TTL',
    value: 'TTL'
  },
  {
    label: 'PTTL',
    value: 'PTTL',
    version: '2.6.0'
  },
  {
    label: 'EXPIRETIME',
    value: 'EXPIRETIME',
    version: '7.0.0'
  },
  {
    label: 'PEXPIRETIME',
    value: 'PEXPIRETIME',
    version: '7.0.0'
  }
]

const TTL: React.FC<{
  keys: APP.Key
}> = ({ keys }) => {
  const connection = useContext(context)

  const [command, setCommand] = React.useState<APP.Command>(commands[0])

  const [value, setValue] = React.useState(0)

  const filterCommands = useCommand(commands, connection)

  const getValue = React.useCallback(() => {
    request<number>('key/ttl', keys.connection_id, {
      name: keys.name,
      value: command.value
    }).then((r) => {
      setValue(r.data)
    })
  }, [command.value, keys])

  React.useEffect(() => {
    getValue()
  }, [getValue])

  const edit = React.useMemo(() => {
    if (isReadonly(connection)) {
      return undefined
    }
    return (
      <TTLForm
        keys={keys}
        onSuccess={getValue}
        trigger={
          <CusButton
            icon={<EditOutlined />}
            size="small"
            type="text"
          ></CusButton>
        }
      />
    )
  }, [connection, keys, getValue])

  return (
    <Input
      value={value}
      readOnly
      addonBefore={
        <Select
          className="!w-34"
          options={filterCommands}
          value={command.value}
          onChange={(e) => {
            const i = commands.find((v) => v.value === e)
            if (i != null) {
              setCommand(i)
            }
          }}
        ></Select>
      }
      addonAfter={edit}
    ></Input>
  )
}
export default observer(TTL)
