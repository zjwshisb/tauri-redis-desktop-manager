import React from 'react'
import { Card, Table } from 'antd'
import { useTranslation } from 'react-i18next'

const DbInfo: React.FC<{
  items: Record<string, string>
}> = ({ items }) => {
  const { t } = useTranslation()

  const [info, setInfo] = React.useState<any[]>([])

  React.useEffect(() => {
    const arr: Array<Record<string, string>> = []
    Object.keys(items).forEach((v) => {
      if (v.startsWith('db')) {
        const i: Record<string, string> = {}
        i.name = v
        const vv = items[v].split(',')
        vv.forEach((vvv) => {
          const kv = vvv.split('=')
          if (kv.length >= 2) {
            i[kv[0]] = kv[1]
          }
        })
        arr.push(i)
      }
      setInfo(arr)
    })
  }, [items])

  return (
    <Card title={t('DB')} className="mt-4">
      <Table
        dataSource={info}
        bordered
        pagination={false}
        columns={[
          {
            dataIndex: 'name',
            title: 'db',
            align: 'center'
          },
          {
            dataIndex: 'keys',
            title: 'keys',
            align: 'center'
          },
          {
            dataIndex: 'expires',
            title: 'expires',
            align: 'center'
          },
          {
            dataIndex: 'avg_ttl',
            title: 'avg_ttl',
            align: 'center'
          }
        ]}
      ></Table>
    </Card>
  )
}
export default DbInfo
