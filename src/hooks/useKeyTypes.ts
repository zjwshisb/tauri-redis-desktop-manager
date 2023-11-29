import React from 'react'
import { useTranslation } from 'react-i18next'

interface KeyTypeItem {
  label: string
  value: APP.Key['sub_types']
  searchable: boolean
}

export default function useKeyTypes(
  searchable: boolean = false
): KeyTypeItem[] {
  const { t } = useTranslation()
  return React.useMemo(() => {
    return [
      {
        label: t('String'),
        value: 'string',
        searchable: true
      },
      {
        label: t('List'),
        value: 'list',
        searchable: true
      },
      {
        label: t('Hash'),
        value: 'hash',
        searchable: true
      },
      {
        label: t('Set'),
        value: 'set',
        searchable: true
      },
      {
        label: t('Sorted Set'),
        value: 'zset',
        searchable: true
      },
      {
        label: t('JSON'),
        value: 'ReJSON-RL',
        searchable: true
      },
      {
        label: t('Top-k'),
        value: 'TopK-TYPE',
        searchable: true
      },
      {
        label: t('Time Series'),
        value: 'TSDB-TYPE',
        searchable: true
      },
      {
        label: t('T-Digest'),
        value: 'TDIS-TYPE',
        searchable: true
      },
      {
        label: t('Bloom Filter'),
        value: 'MBbloom--',
        searchable: true
      },
      {
        label: t('Cuckoo Filter'),
        value: 'MBbloomCF',
        searchable: true
      },
      {
        label: t('Count-Min Sketch'),
        value: 'CMSk-TYPE',
        searchable: true
      },
      {
        label: t('HyperLogLog'),
        value: 'HyperLogLog',
        searchable: false
      }
    ].filter((v) => {
      if (searchable) {
        return v.searchable
      }
      return true
    })
  }, [t, searchable]) as KeyTypeItem[]
}
