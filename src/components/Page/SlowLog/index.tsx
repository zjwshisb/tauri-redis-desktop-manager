import useRequest from '@/hooks/useRequest'
import React from 'react'
import dayjs from 'dayjs'
import Page from '..'
import CusTable from '@/components/CusTable'
import useTableColumn from '@/hooks/useTableColumn'
import { App, Button, Descriptions, Input, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import request from '@/utils/request'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'

const SlowLog: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = ({ connection, pageKey }) => {
  const [search, setSearch] = React.useState('')

  const { data, loading, fetch } = useRequest<{
    logs: APP.SlowLog[]
    time: number
    count: number
  }>('server/slow-log', connection.id)

  const { modal, message } = App.useApp()

  const { t } = useTranslation()

  const items = React.useMemo(() => {
    return data?.logs.filter((v) => {
      if (search !== '') {
        return v.cmd.toLowerCase().includes(search.toLowerCase())
      }
      return data?.logs
    })
  }, [data?.logs, search])

  const columns = useTableColumn<APP.SlowLog>([
    {
      dataIndex: 'id',
      title: 'id'
    },
    {
      dataIndex: 'processed_at',
      title: 'processed_at',
      render(v) {
        return dayjs.unix(v).format('YYYY-MM-DDTHH:mm:ssZ[Z]')
      }
    },
    {
      dataIndex: 'time',
      title: 'amount time(us)',
      defaultSortOrder: 'descend',
      sorter(a, b) {
        return a.time > b.time ? 1 : -1
      }
    },
    {
      dataIndex: 'cmd',
      title: 'cmd',
      render(v) {
        return (
          <Highlighter searchWords={[search]} textToHighlight={v}></Highlighter>
        )
      }
    },
    {
      dataIndex: 'client_ip',
      title: 'client_ip'
    },
    {
      dataIndex: 'client_name',
      title: 'client_name'
    }
  ])

  return (
    <Page pageKey={pageKey} onRefresh={fetch} loading={loading}>
      <div className="mb-2">
        <div className="mb-2">
          <Descriptions
            bordered
            size="small"
            column={2}
            items={[
              {
                label: 'slowlog-log-slower-than',
                children: data?.time
              },
              {
                label: 'slowlog-max-len',
                children: data?.count
              }
            ]}
          ></Descriptions>
        </div>
        <Space>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Filter"
            allowClear
            onChange={(e) => {
              setSearch(e.target.value)
            }}
          />
          <Button
            danger
            type="primary"
            onClick={() => {
              modal.confirm({
                title: t('Notice'),
                content: t(
                  'Are you sure resets the slow log, clearing all entries in it?'
                ),
                onOk() {
                  request('server/reset-slow-log', connection.id).then(() => {
                    message.success(t('Success'))
                    fetch()
                  })
                }
              })
            }}
          >
            {t('Clear')}
          </Button>
        </Space>
      </div>
      <CusTable
        rowKey={'uid'}
        virtual={false}
        dataSource={items}
        columns={columns}
      ></CusTable>
    </Page>
  )
}
export default SlowLog
