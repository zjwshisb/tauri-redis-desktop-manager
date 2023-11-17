import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ButtonAction from '@/components/ButtonAction'

const Incr: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
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
        onSuccess()
      }}
    >
      {t('INCR')}
    </ButtonAction>
  )
}
export default Incr
