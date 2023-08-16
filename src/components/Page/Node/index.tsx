import useRequest from '@/hooks/useRequest'
import { Col, Row, Spin, Table } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import React from 'react'

const Node: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const { data, loading } = useRequest<APP.Node[]>(
    'cluster/node-list',
    connection.id
  )

  const columns: ColumnsType<APP.Node> = React.useMemo(() => {
    const fields = [
      'id',
      'config_epoch',
      'flags',
      'host',
      'link_state',
      'master',
      'ping_sent',
      'pong_recv',
      'slot'
    ]
    return fields.map((v) => {
      return {
        dataIndex: v,
        title: v,
        align: 'center'
      }
    })
  }, [])

  console.log(data)

  return (
    <Spin spinning={loading}>
      <Row>
        <Col span={24}>
          <Table
            dataSource={data?.sort((a, b) =>
              a.config_epoch > b.config_epoch ? 1 : -1
            )}
            pagination={false}
            size="small"
            rowKey={'id'}
            scroll={{
              x: 'auto'
            }}
            bordered
            columns={columns}
          ></Table>
        </Col>
      </Row>
    </Spin>
  )
}
export default Node
