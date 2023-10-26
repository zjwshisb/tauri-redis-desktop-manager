import React from 'react'
import { useTranslation } from 'react-i18next'

export default function useKeyTypes(): Array<{
  label: string
  value: APP.Key['types']
}> {
  const { t } = useTranslation()
  return React.useMemo(() => {
    return [
      {
        label: t('String'),
        value: 'string'
      },
      {
        label: t('List'),
        value: 'list'
      },
      {
        label: t('Hash'),
        value: 'hash'
      },
      {
        label: t('Set'),
        value: 'set'
      },
      {
        label: t('Sorted Set'),
        value: 'zset'
      },
      {
        label: t('JSON'),
        value: 'ReJSON-RL'
      },
      {
        label: t('Top-k'),
        value: 'TopK-TYPE'
      },
      {
        label: t('Time Series'),
        value: 'TSDB-TYPE'
      },
      {
        label: t('T-Digest'),
        value: 'TDIS-TYPE'
      },
      {
        label: t('Bloom Filter'),
        value: 'MBbloom--'
      }
    ]
  }, [t])
}
