import React from 'react'

import { Input, Select } from 'antd'
import TypeSelect from '@/components/TypeSelect'
import { useTranslation } from 'react-i18next'
import useDatabaseOption from '@/hooks/useDatabaseOption'

export interface FilterForm {
  search: string
  db: number
  types: string
}

const Filter: React.FC<{
  connection: APP.Connection
  value: FilterForm
  onValueChange: (v: FilterForm) => void
}> = ({ connection, value, onValueChange }) => {
  const { t } = useTranslation()

  const update: <T extends keyof FilterForm>(
    name: T,
    value: FilterForm[T]
  ) => void = React.useCallback(
    (n, v) => {
      const newSta = { ...value }
      newSta[n] = v
      onValueChange(newSta)
    },
    [onValueChange, value]
  )

  const options = useDatabaseOption(connection)

  return (
    <>
      <div className="mb-2 w-[200px] mr-2">
        <Input
          value={value.search}
          placeholder={t('Filter').toString()}
          onChange={(e) => {
            update('search', e.target.value)
          }}
        ></Input>
      </div>
      {!connection.is_cluster && (
        <div className="mr-2 mb-2">
          <Select
            value={value.db}
            placeholder={t('Databases')}
            className="w-[200px]"
            onChange={(v) => {
              update('db', v)
            }}
            options={options}
          ></Select>
        </div>
      )}
      <TypeSelect
        value={value.types}
        connection={connection}
        className="mb-2 mr-2 w-[200px]"
        selectClassName="w-full"
        onChange={(e) => {
          update('types', e)
        }}
      ></TypeSelect>
    </>
  )
}

export default Filter
