import React from 'react'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { Line } from '@ant-design/plots'
import dayjs from 'dayjs'

interface Point {
  category: string
  value: number
  label: string
}

const Network: React.FC<{
  items: Record<string, any>
}> = ({ items }) => {
  const { t } = useTranslation()

  const [lines, setLines] = React.useState<Point[]>([])

  React.useEffect(() => {
    if (items.instantaneous_input_kbps !== undefined) {
      setLines((prev) => {
        return [...prev].concat([
          {
            label: dayjs().format('HH:mm:ss'),
            value: parseFloat(items.instantaneous_input_kbps),
            category: 'in'
          },
          {
            label: dayjs().format('HH:mm:ss'),
            value: parseFloat(items.instantaneous_output_kbps),
            category: 'out'
          }
        ])
      })
    }
  }, [items])

  return (
    <Card title={t('Network')} className="mt-4">
      <Line
        slider={{
          start: 0,
          end: 1
        }}
        data={lines}
        xField="label"
        seriesField="category"
        yAxis={{
          label: {
            formatter(text, item, index) {
              return text + 'kbps'
            }
          }
        }}
        xAxis={{}}
        yField="value"
        smooth={true}
        animation={false}
      />
    </Card>
  )
}
export default Network
