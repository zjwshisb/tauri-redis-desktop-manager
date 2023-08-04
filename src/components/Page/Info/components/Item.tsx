import React from 'react'
import { Card, Col, Row, Table, Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'

import Memory from './Memory'
import Network from './Network'
import Ops from './Ops'
import Client from './Client'
import DbInfo from './DbInfo'

interface Item {
  label: string
  value: string
}

const Index: React.FC<{
  data: string
}> = ({ data }) => {
  const { t } = useTranslation()

  const info = React.useMemo(() => {
    if (data == null) {
      return []
    }
    return data
      ?.split('#')
      .filter((v) => v !== '')
      .map((v) => {
        const info = v.split('\r\n')
        const item: {
          type: string
          value: Record<string, string>
        } = {
          type: info.splice(0, 1)[0],
          value: {}
        }
        info
          .filter((v) => v !== '')
          .forEach((v) => {
            const lv = v.split(':')
            item.value[lv[0]] = lv[1]
          })

        return item
      })
  }, [data])

  const inKv = React.useMemo(() => {
    const fields: Record<string, string> = {}
    info.forEach((v) => {
      Object.keys(v.value).forEach((vv) => {
        fields[vv] = v.value[vv]
      })
    })
    return fields
  }, [info])

  const items = React.useMemo(() => {
    const fields: Item[] = []
    info.forEach((v) => {
      Object.keys(v.value).forEach((vv) => {
        fields.push({
          label: vv,
          value: v.value[vv]
        })
      })
    })
    return fields
  }, [info])

  return (
    <div>
      <Card title={t('Base Info')}>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label={'Redis ' + t('Version')}>
            {inKv.redis_version}
          </Descriptions.Item>
          <Descriptions.Item label={'Redis ' + t('Mode')}>
            {inKv.redis_mode}
          </Descriptions.Item>
          <Descriptions.Item label={t('Config File')}>
            {inKv.config_file}
          </Descriptions.Item>
          <Descriptions.Item label={t('OS')}>{inKv.os}</Descriptions.Item>
          <Descriptions.Item label={'Tcp' + t('Port')}>
            {inKv.tcp_port}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Row className="mt-4" gutter={20}>
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
      </Row>
      <Row className="mt-4">
        <Col span={24}>
          <DbInfo items={inKv} />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col span={24}>
          <Card title={t('All Info')}>
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
