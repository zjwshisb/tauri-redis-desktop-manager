import React from 'react'
import { Card, Col, Row, Descriptions, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'

import DbInfo from './DbInfo'
import CusTable from '@/components/CusTable'

const Item: React.FC<{
  data: Record<string, string>
}> = ({ data }) => {
  const { t } = useTranslation()

  const [search, setSearch] = React.useState('')

  const items = React.useMemo(() => {
    const fields: APP.Field[] = []
    Object.keys(data).forEach((vv) => {
      if (vv.includes(search.toLocaleLowerCase())) {
        fields.push({
          name: vv,
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
            <CusTable
              rowKey={'name'}
              dataSource={items}
              columns={[
                {
                  title: t('Key'),
                  dataIndex: 'name',
                  defaultSortOrder: 'ascend',
                  sorter(a, b) {
                    return a.name > b.name ? 1 : -1
                  }
                },
                {
                  title: t('Value'),
                  dataIndex: 'value'
                }
              ]}
            ></CusTable>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default Item
