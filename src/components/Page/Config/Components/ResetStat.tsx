import Editable from '@/components/Editable'

import { Button, App } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Link from '@/components/Link'
import request from '@/utils/request'

const ResetStat: React.FC<{
  connection: APP.Connection
  onSuccess?: () => void
}> = ({ connection, onSuccess }) => {
  const { t } = useTranslation()

  const { modal, message } = App.useApp()

  return (
    <Editable connection={connection}>
      <div className="ml-2">
        <Button
          type="primary"
          onClick={() => {
            modal.confirm({
              title: t('Notice'),
              content: (
                <div>
                  <div>{t('Are you sure do this action?')}</div>
                  <div>
                    {t('Detailed In')}
                    <Link href="https://redis.io/commands/config-resetstat/">
                      [https://redis.io/commands/config-resetstat/]
                    </Link>
                  </div>
                </div>
              ),
              async onOk() {
                await request('config/resetstat', connection.id)
                if (onSuccess !== undefined) {
                  onSuccess()
                }
                message.success(t('Success'))
              }
            })
          }}
        >
          RESETSTAT
        </Button>
      </div>
    </Editable>
  )
}
export default ResetStat
