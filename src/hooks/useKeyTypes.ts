import React from 'react'
import { useTranslation } from 'react-i18next'

interface KeyTypeItem {
  label: string
  value: APP.Key['sub_types']
  searchable: boolean
  disabled?: boolean
}

export default function useKeyTypes(
  connection: APP.Connection,
  searchable: boolean = false,
): KeyTypeItem[] {
  const { t } = useTranslation()

  const bloomDisabled = React.useMemo(() => {
    return (connection.modules?.find(v => {
      return v.name.toLowerCase().includes('bf')
    })) == null
  }, [connection.modules])

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
        label: t('HyperLogLog'),
        value: 'HyperLogLog',
        searchable: false
      },
      {
        label: t('JSON'),
        value: 'ReJSON-RL',
        searchable: true,
        disabled: (connection.modules?.find(v => {
          return v.name.toLowerCase().includes('rejson')
        })) == null
      },
      {
        label: t('Top-k'),
        value: 'TopK-TYPE',
        searchable: true,
        disabled: bloomDisabled
      },
      {
        label: t('Time Series'),
        value: 'TSDB-TYPE',
        searchable: true,
        disabled: (connection.modules?.find(v => {
          return v.name.toLowerCase().includes('timeseries')
        })) == null
      },
      {
        label: t('T-Digest'),
        value: 'TDIS-TYPE',
        searchable: true,
        disabled: bloomDisabled
      },
      {
        label: t('Bloom Filter'),
        value: 'MBbloom--',
        searchable: true,
        disabled: bloomDisabled
      },
      {
        label: t('Cuckoo Filter'),
        value: 'MBbloomCF',
        searchable: true,
        disabled: bloomDisabled
      },
      {
        label: t('Count-Min Sketch'),
        value: 'CMSk-TYPE',
        searchable: true,
        disabled: bloomDisabled
      }
    ].filter((v) => {
      if (searchable) {
        return v.searchable
      }
      return true
    })
  }, [t, bloomDisabled, connection.modules, searchable]) as KeyTypeItem[]
}
