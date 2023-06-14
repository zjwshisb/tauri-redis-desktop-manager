import React from 'react'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { Line } from '@ant-design/plots'
import dayjs from 'dayjs'

interface Point {
  count: number
  time: string
}

const Ops: React.FC<{
  items: Record<string, any>
}> = ({ items }) => {
  const { t } = useTranslation()

  const [lines, setLines] = React.useState<Point[]>([])

  React.useEffect(() => {
    if (items.instantaneous_ops_per_sec !== undefined) {
      setLines((prev) => {
        return [...prev].concat([
          {
            time: dayjs().format('HH:mm:ss'),
            count: parseInt(items.instantaneous_ops_per_sec)
          }
        ])
      })
    }
  }, [items])

  return (
    <Card title={t('Ops')} className="mt-4">
      <Line
        slider={{
          start: 0,
          end: 1
        }}
        data={lines}
        xField="time"
        yAxis={{}}
        xAxis={{}}
        yField="count"
        smooth={true}
        animation={false}
      />
    </Card>
  )
}
export default Ops
