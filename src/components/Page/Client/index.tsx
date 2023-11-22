import useRequest from '@/hooks/useRequest'
import { Space, Tooltip, App } from 'antd'
import React from 'react'
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { type ColumnType } from 'antd/es/table'
import request from '@/utils/request'
import Page from '..'
import useTableColumn from '@/hooks/useTableColumn'
import Editable from '@/components/Editable'
import CusTable from '@/components/CusTable'
import CusButton from '@/components/CusButton'

interface ClientRow {
  id: string
  addr: string
  laddr: string
  fd: string
  name: string
  age: string
  idle: string
  flags: string
  db: string
  sub: string
  psub: string
  ssub: string
  multi: string
  qbuf: string
  'qbuf-free': string
  'argv-mem': string
  'multi-mem': string
  obl: string
  oll: string
  omem: string
  'tot-mem': string
  events: string
  cmd: string
  user: string
  redir: string
  resp: string
}

function clientColumn(title: string, tooltip: string): ColumnType<ClientRow> {
  return {
    dataIndex: title,
    title: (
      <Tooltip title={tooltip}>
        {title}
        <QuestionCircleOutlined className="text-sm ml-2" />
      </Tooltip>
    )
  }
}

const Client: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = ({ connection, pageKey }) => {
  const {
    data: clientStr,
    loading,
    fetch
  } = useRequest<string>('client/list', connection.id)

  const { modal, message } = App.useApp()

  const clients = React.useMemo(() => {
    if (clientStr !== undefined) {
      return clientStr
        .split('\n')
        .filter((v) => v.trim() !== '')
        .map((v) => {
          const client: Record<string, string> = {}
          v.split(' ').forEach((vvv) => {
            const field2Value = vvv.split('=')
            if (field2Value.length === 2) {
              client[field2Value[0]] = field2Value[1]
            }
          })
          return client as unknown as ClientRow
        })
    }
    return []
  }, [clientStr])

  const handleKill = React.useCallback(
    (id: string) => {
      modal.confirm({
        title: 'notice',
        content: `are you sure kill the client<${id}>`,
        async onOk() {
          await request('client/kill', connection.id, {
            id
          }).then(() => {
            fetch()
            message.success('success')
          })
        }
      })
    },
    [connection.id, fetch, message, modal]
  )

  const columns = useTableColumn(
    [
      clientColumn('id', 'a unique 64-bit client ID'),
      clientColumn('addr', 'address/port of the client'),
      clientColumn(
        'laddr',
        'address/port of local address client connected to (bind address)'
      ),
      clientColumn('fd', ' file descriptor corresponding to the socket'),
      clientColumn('name', 'the name set by the client with CLIENT SETNAME'),
      clientColumn('age', 'total duration of the connection in seconds'),
      clientColumn('idle', 'idle time of the connection in seconds'),
      clientColumn('flags', 'client flags (see below)'),
      clientColumn('db', 'current database ID'),
      clientColumn('sub', 'number of channel subscriptions'),
      clientColumn('psub', 'number of pattern matching subscriptions'),
      clientColumn(
        'ssub',
        'number of shard channel subscriptions. Added in Redis 7.0.3'
      ),
      clientColumn('multi', 'number of commands in a MULTI/EXEC context'),
      clientColumn('qbuf', 'query buffer length (0 means no query pending)'),
      clientColumn(
        'qbuf-free',
        'free space of the query buffer (0 means the buffer is full)'
      ),
      clientColumn('argv-mem', 'argv-mem'),
      clientColumn(
        'multi-mem',
        'memory is used up by buffered multi commands. Added in Redis 7.0'
      ),
      clientColumn('obl', 'output buffer length'),
      clientColumn(
        'oll',
        'output list length (replies are queued in this list when the buffer is full)'
      ),
      clientColumn('omem', 'output buffer memory usage'),
      clientColumn(
        'tot-mem',
        'total memory consumed by this client in its various buffers'
      ),
      clientColumn('events', 'file descriptor events (see below)'),
      clientColumn('cmd', 'last command played'),
      clientColumn('user', ' the authenticated username of the client'),
      clientColumn('redir', 'client id of current client tracking redirection'),
      clientColumn('resp', 'client RESP protocol version. Added in Redis 7.0')
    ],
    {
      render(_, record) {
        return (
          <Space>
            <Editable connection={connection}>
              <CusButton
                type="link"
                onClick={() => {
                  handleKill(record.id)
                }}
                icon={<DeleteOutlined />}
              ></CusButton>
            </Editable>
          </Space>
        )
      }
    },
    !connection.readonly
  )

  return (
    <Page onRefresh={fetch} pageKey={pageKey} loading={loading}>
      <CusTable
        virtual={false}
        rowKey={'id'}
        dataSource={clients}
        columns={columns}
      ></CusTable>
    </Page>
  )
}
export default Client
