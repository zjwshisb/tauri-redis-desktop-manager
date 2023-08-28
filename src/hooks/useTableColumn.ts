import { type TableColumnType, type TableColumnsType } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function useTableColumn<T>(
  columns: TableColumnsType<T>,
  action?: TableColumnType<T>,
  showAction = true,
  showIndex = true
) {
  const { t } = useTranslation()
  return React.useMemo(() => {
    const cols = columns
    if (showIndex) {
      cols.unshift({
        title: '#',
        width: 100,
        render(_, __, index) {
          return index + 1
        }
      })
    }
    if (showAction && action !== undefined) {
      cols.push({
        ...action,
        title: t('Action')
      })
    }
    for (const x of cols) {
      if (x.align === undefined) {
        x.align = 'center'
      }
    }
    return cols
  }, [action, columns, showAction, showIndex, t])
}
