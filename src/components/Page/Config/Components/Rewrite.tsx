import Editable from '@/components/Editable'

import { App, Button } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Link from '@/components/Link'
import request from '@/utils/request'

const Rewrite: React.FC<{
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
                    <Link href="https://redis.io/commands/config-rewrite/">
                      [https://redis.io/commands/config-rewrite/]
                    </Link>
                  </div>
                </div>
              ),
              async onOk() {
                await request('config/rewrite', connection.id)
                if (onSuccess !== undefined) {
                  onSuccess()
                }
                message.success(t('Success'))
              }
            })
          }}
        >
          REWRITE
        </Button>
      </div>
    </Editable>
  )
}
export default Rewrite
