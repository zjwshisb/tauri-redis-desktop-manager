import React from 'react'
import { Card, Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'
import { Line } from '@ant-design/plots'
import dayjs from 'dayjs'

interface Point {
  value: any
  label: any
}

const Memory: React.FC<{
  items: Record<string, any>
}> = ({ items }) => {
  const { t } = useTranslation()

  const [lines, setLines] = React.useState<Point[]>([])

  React.useEffect(() => {
    setLines((prev) => {
      return [...prev].concat([
        {
          label: dayjs(),
          value: items.used_memory / 1024 / 1024
        }
      ])
    })
  }, [items])

  return (
    <Card title={t('Memory')}>
      <div>
        <Line
          data={lines}
          xField="label"
          //   yAxis={{
          //     type: 'time'
          //   }}
          yField="value"
          smooth={true}
          animation={false}
        />
      </div>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label={t('System Memory')}>
          {items.total_system_memory_human}
        </Descriptions.Item>
        <Descriptions.Item label={t('Used Memory')}>
          {items.used_memory_human}
        </Descriptions.Item>
        <Descriptions.Item label={t('Max Memory')}>
          {items.maxmemory_human}
        </Descriptions.Item>
        <Descriptions.Item label={t('Used Memory Rss')}>
          {items.used_memory_rss_human}
        </Descriptions.Item>
        <Descriptions.Item label={t('Used Memory Peak')}>
          {items.used_memory_peak_human}
        </Descriptions.Item>
        <Descriptions.Item label={t('Used Memory Lua')}>
          {items.used_memory_lua_human}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}
export default Memory
