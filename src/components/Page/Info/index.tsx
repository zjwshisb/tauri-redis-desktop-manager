import React from 'react'
import useRequest from '@/hooks/useRequest'
import { Card, Col, Divider, Row, Table, Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'

interface Item {
  label: string
  value: string
}

const Index: React.FC<{
  connection: APP.Connection
}> = (props) => {
  const { data } = useRequest<string>('server/info', props.connection.id)

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

  React.useEffect(() => {
    console.log(info)
  }, [info])

  return (
    <div>
      <Row gutter={20}>
        <Col span={12}>
          <Card title={t('Server')}>
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
        </Col>
        <Col span={12}>
          <Card title={t('Memory')}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label={t('System Memory')}>
                {inKv.total_system_memory_human}
              </Descriptions.Item>
              <Descriptions.Item label={t('Used Memory')}>
                {inKv.used_memory_human}
              </Descriptions.Item>
              <Descriptions.Item label={t('Used Memory Rss')}>
                {inKv.used_memory_rss_human}
              </Descriptions.Item>
              <Descriptions.Item label={t('Used Memory Peak')}>
                {inKv.used_memory_peak_human}
              </Descriptions.Item>
              <Descriptions.Item label={t('Used Memory Lua')}>
                {inKv.used_memory_lua_human}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Divider orientation="left">{t('All Info')}</Divider>
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
    </div>
  )
}
export default Index
