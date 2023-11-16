import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ButtonAction from '@/components/ButtonAction'

const Incr: React.FC<{
  keys: APP.StringKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const { t } = useTranslation()

  return (
    <ButtonAction
      type="primary"
      documentUrl="https://redis.io/commands/incr/"
      onSubmit={async () => {
        await request('string/incr', keys.connection_id, {
          db: keys.db,
          name: keys.name
        })
        onRefresh()
      }}
    >
      {t('INCR')}
    </ButtonAction>
  )
}
export default Incr
