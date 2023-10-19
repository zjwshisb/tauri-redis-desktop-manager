import React from 'react'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import CusTable from '@/components/CusTable'

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
      arr.sort((a, b) => {
        const db1 = a.name.substring(2)
        const db2 = b.name.substring(2)
        return parseInt(db1, 10) - parseInt(db2, 10)
      })
      setInfo(arr)
    })
  }, [items])

  return (
    <Card title={t('DB')} className="mt-4">
      <CusTable
        dataSource={info}
        virtual={false}
        showFooter={false}
        rowKey={'name'}
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
      ></CusTable>
    </Card>
  )
}
export default DbInfo
