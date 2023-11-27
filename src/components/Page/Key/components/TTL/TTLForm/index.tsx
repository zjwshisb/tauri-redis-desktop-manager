import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormSelectItem from '@/components/Form/FormSelectItem'
import { Form } from 'antd'
import BaseKeyForm from '../../BaseKeyForm'
import connectionContext from '../../../context'
import useCommand from '@/hooks/useCommand'
import { observer } from 'mobx-react-lite'

const commands: APP.Command[] = [
  {
    label: 'EXPIRE',
    value: 'EXPIRE',
    url: 'https://redis.io/commands/expire/'
  },
  {
    label: 'EXPIREAT',
    value: 'EXPIREAT',
    url: 'https://redis.io/commands/expireat/',
    version: '2.6.0'
  },
  {
    label: 'PERSIST',
    value: 'PERSIST',
    url: 'https://redis.io/commands/persist/',
    version: '2.6.0'
  },
  {
    label: 'PEXPIRE',
    value: 'PEXPIRE',
    url: 'https://redis.io/commands/pexpire/',
    version: '2.6.0'
  },
  {
    label: 'PEXPIREAT',
    value: 'PEXPIREAT',
    url: 'https://redis.io/commands/pexpireat/'
  }
]

const TTLForm: React.FC<{
  keys: APP.Key
  trigger: React.ReactElement
  onSuccess: (ttl: number) => void
}> = (props) => {
  const [command, setCommand] = React.useState<APP.Command>()

  const connection = React.useContext(connectionContext)

  const filterCommands = useCommand(commands, connection)

  return (
    <ModalForm
      documentUrl={command?.url}
      width={400}
      onSubmit={async (v) => {
        await request<number>('key/expire', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        }).then(() => {
          props.onSuccess(v.ttl)
        })
      }}
      title={command?.label}
      trigger={props.trigger}
      defaultValue={{
        name: props.keys.name,
        command: 'EXPIRE'
      }}
    >
      <FormSelectItem
        name={'command'}
        label="Command"
        required
        inputProps={{
          options: filterCommands
        }}
      ></FormSelectItem>
      <BaseKeyForm>
        <Form.Item noStyle dependencies={['command']}>
          {(e) => {
            const commandStr = e.getFieldValue('command')
            const item = commands.find((v) => v.value === commandStr)
            setCommand(item)
            let node = <></>
            switch (commandStr) {
              case undefined: {
                return <></>
              }
              case 'PERSIST':
                return <></>
              case 'EXPIRE':
                node = (
                  <FormInputNumberItem label="Seconds" name={'ttl'} required />
                )
                break
              case 'EXPIREAT':
                node = (
                  <FormInputNumberItem
                    label="Unix Time Seconds"
                    name={'ttl'}
                    required
                  />
                )
                break
              case 'PEXPIRE':
                node = (
                  <FormInputNumberItem
                    label="Milliseconds"
                    name={'ttl'}
                    required
                  />
                )
                break
              case 'PEXPIREAT':
                node = (
                  <FormInputNumberItem
                    required
                    label="Unix Time Milliseconds"
                    name={'ttl'}
                  />
                )
                break
            }
            return (
              <>
                {node}
                <FormSelectItem
                  name="option"
                  label="Options"
                  inputProps={{
                    options: [
                      { value: 'NX', label: 'NX' },
                      { value: 'XX', label: 'XX' },
                      { value: 'GT', label: 'GT' },
                      { value: 'LT', label: 'LT' }
                    ]
                  }}
                />
              </>
            )
          }}
        </Form.Item>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default observer(TTLForm)
