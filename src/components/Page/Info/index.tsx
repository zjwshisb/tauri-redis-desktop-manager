import React from 'react'
import useRequest from '@/hooks/useRequest'
import { Card, Col, Row, Table, Descriptions, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import useStore from '@/hooks/useStore'

import Memory from './components/Memory'
import Network from './components/Network'
import Ops from './components/Ops'
import Client from './components/Client'
import DbInfo from './components/DbInfo'

interface Item {
  label: string
  value: string
}

const Index: React.FC<{
  connection: APP.Connection
}> = (props) => {
  const [autoRefresh, setAutoRefresh] = React.useState(true)

  const { data, fetch } = useRequest<string>('server/info', props.connection.id)

  const { t } = useTranslation()

  const store = useStore()

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

  React.useEffect(() => {
    store.connection.update(props.connection.id, {
      version: inKv.redis_version
    })
  }, [inKv, props.connection.id, store])

  React.useEffect(() => {
    if (autoRefresh) {
      const i = setInterval(fetch, 5 * 1000)
      return () => {
        clearInterval(i)
      }
    }
    return () => {}
  }, [autoRefresh, fetch])

  return (
    <div>
      <Card
        title={t('Base Info')}
        extra={
          <div>
            <span className="mr-2">{t('Auto Refresh')}</span>
            <Switch
              checked={autoRefresh}
              onChange={(e) => {
                setAutoRefresh(e)
              }}
            ></Switch>
          </div>
        }
      >
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
