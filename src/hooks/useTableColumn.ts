import React from 'react'
import { type ColumnType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'

export default function useTableColumn<T>(
  columns: Array<ColumnType<T>>,
  action?: ColumnType<T>,
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
      if (x.title === undefined && x.dataIndex !== undefined) {
        x.title = x.dataIndex
      }
    }
    return cols
  }, [action, columns, showAction, showIndex, t])
}
