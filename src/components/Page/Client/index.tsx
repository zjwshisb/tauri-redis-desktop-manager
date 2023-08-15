import useRequest from '@/hooks/useRequest'
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tooltip,
  message
} from 'antd'
import React from 'react'
import {
  DeleteOutlined,
  QuestionCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { type ColumnType } from 'antd/es/table'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import IconButton from '@/components/IconButton'

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
    align: 'center',
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
}> = ({ connection }) => {
  const {
    data: clientStr,
    loading,
    fetch
  } = useRequest<string>('client/list', connection.id)

  const { t } = useTranslation()

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
      Modal.confirm({
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
    [connection.id, fetch]
  )

  return (
    <Spin spinning={loading}>
      <Row gutter={10} className="mb-2">
        <Col xs={24} xl={8} className="mb-2">
          <Input addonBefore={'total'} value={clients.length} readOnly></Input>
        </Col>
        <Col xs={24} xl={8} className="mb-2">
          <Button>
            <ReloadOutlined onClick={fetch} />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            pagination={false}
            size="small"
            rowKey={'id'}
            scroll={{
              x: 'auto'
            }}
            bordered
            dataSource={clients}
            columns={[
              clientColumn('id', 'a unique 64-bit client ID'),
              clientColumn('addr', 'address/port of the client'),
              clientColumn(
                'laddr',
                'address/port of local address client connected to (bind address)'
              ),
              clientColumn(
                'fd',
                ' file descriptor corresponding to the socket'
              ),
              clientColumn(
                'name',
                'the name set by the client with CLIENT SETNAME'
              ),
              clientColumn(
                'age',
                'total duration of the connection in seconds'
              ),
              clientColumn('idle', 'idle time of the connection in seconds'),
              clientColumn('flags', 'client flags (see below)'),
              clientColumn('db', 'current database ID'),
              clientColumn('sub', 'number of channel subscriptions'),
              clientColumn('psub', 'number of pattern matching subscriptions'),
              clientColumn(
                'ssub',
                'number of shard channel subscriptions. Added in Redis 7.0.3'
              ),
              clientColumn(
                'multi',
                'number of commands in a MULTI/EXEC context'
              ),
              clientColumn(
                'qbuf',
                'query buffer length (0 means no query pending)'
              ),
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
              clientColumn(
                'redir',
                'client id of current client tracking redirection'
              ),
              clientColumn(
                'resp',
                'client RESP protocol version. Added in Redis 7.0'
              ),
              {
                title: t('Action'),
                fixed: 'right',
                align: 'center',
                render(_, record) {
                  return (
                    <Space>
                      <IconButton
                        onClick={() => {
                          handleKill(record.id)
                        }}
                        icon={<DeleteOutlined />}
                      ></IconButton>
                    </Space>
                  )
                }
              }
            ]}
          ></Table>
        </Col>
      </Row>
    </Spin>
  )
}
export default Client
