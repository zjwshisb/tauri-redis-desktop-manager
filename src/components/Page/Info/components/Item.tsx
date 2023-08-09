import React from 'react'
import { Card, Col, Row, Table, Descriptions, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'

// import Memory from './Memory'
// import Network from './Network'
// import Ops from './Ops'
// import Client from './Client'
import DbInfo from './DbInfo'

interface Item {
  label: string
  value: string
}

const Index: React.FC<{
  data: Record<string, string>
}> = ({ data }) => {
  const { t } = useTranslation()

  const [search, setSearch] = React.useState('')

  const items = React.useMemo(() => {
    const fields: Item[] = []
    Object.keys(data).forEach((vv) => {
      if (vv.includes(search)) {
        fields.push({
          label: vv,
          value: data[vv]
        })
      }
    })
    return fields
  }, [data, search])

  return (
    <div>
      <Card title={t('Base Info')}>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label={'Redis ' + t('Version')}>
            {data.redis_version}
          </Descriptions.Item>
          <Descriptions.Item label={'Redis ' + t('Mode')}>
            {data.redis_mode}
          </Descriptions.Item>
          <Descriptions.Item label={t('Config File')}>
            {data.config_file}
          </Descriptions.Item>
          <Descriptions.Item label={t('OS')}>{data.os}</Descriptions.Item>
          <Descriptions.Item label={'Tcp' + t('Port')}>
            {data.tcp_port}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      {/* <Row className="mt-4" gutter={20}>
        <Col span={12}>
          <Memory items={inKv} />
        </Col>
        <Col span={12}>
          <Network items={inKv} />
        </Col>
      </Row>
      <Row className="mt-4" gutter={20}>
        <Col span={12}>
          <Client items={inKv} />
        </Col>
        <Col span={12}>
          <Ops items={inKv} />
        </Col>
      </Row> */}
      <Row className="mt-4">
        <Col span={24}>
          <DbInfo items={data} />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col span={24}>
          <Card title={t('All Info')}>
            <div className="mb-2 w-[200px]">
              <Input
                prefix={<SearchOutlined />}
                value={search}
                allowClear
                placeholder={t('search').toString()}
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
              />
            </div>
            <Table
              bordered
              size="small"
              pagination={false}
              rowKey={'label'}
              dataSource={items}
              columns={[
                {
                  title: t('Key'),
                  dataIndex: 'label',
                  sorter(a, b) {
                    return a.label > b.label ? 1 : -1
                  }
                },
                {
                  title: t('Value'),
                  dataIndex: 'value'
                }
              ]}
            ></Table>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default Index
