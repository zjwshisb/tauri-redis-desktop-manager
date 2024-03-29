import useRequest from '@/hooks/useRequest'
import { App, Card, Descriptions } from 'antd'
import React from 'react'
import { isArray } from 'lodash'
import { useTranslation } from 'react-i18next'
import Link from '@/components/Link'
import request from '@/utils/request'
import CusButton from '@/components/CusButton'

const Stats: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const { data } = useRequest<APP.Field[][]>('memory/stats', connection.id)

  const { t } = useTranslation()

  const { modal, message } = App.useApp()

  const renderItem = React.useCallback((i: APP.Field[]) => {
    return i.map((v) => {
      let children: React.ReactNode = <></>
      if (!isArray(v.value)) {
        children = v.value
      } else {
        children = v.value.map((vv) => {
          return (
            <div key={vv.field}>
              <span>{vv.field}:</span>
              <span>{vv.value as string}</span>
            </div>
          )
        })
      }
      return {
        label: v.field,
        key: v.value,
        children
      }
    })
  }, [])

  const children = React.useMemo(() => {
    if (data?.length === 1) {
      return (
        <Descriptions
          bordered
          size="small"
          column={2}
          items={renderItem(data[0])}
        ></Descriptions>
      )
    } else {
      return data?.map((v, index) => {
        return (
          <Card
            key={index}
            title={`Server ${index}`}
            size="small"
            className="!mb-4"
          >
            <Descriptions
              bordered
              size="small"
              column={2}
              items={renderItem(v)}
            ></Descriptions>
          </Card>
        )
      })
    }
  }, [data, renderItem])

  return (
    <div>
      <div className="mb-2">
        <CusButton
          onClick={() => {
            modal.confirm({
              title: t('Notice'),
              content: (
                <div>
                  <div>{t('Are you sure do this action?')}</div>
                  <div>
                    {t('Detailed In')}
                    <Link href="https://redis.io/commands/memory-purge/">
                      [https://redis.io/commands/config-resetstat/]
                    </Link>
                  </div>
                </div>
              ),
              async onOk() {
                await request('memory/purge', connection.id)
                message.success(t('Success'))
              }
            })
          }}
        >
          MEMORY PURGE
        </CusButton>
      </div>
      {children}
    </div>
  )
}

export default Stats
