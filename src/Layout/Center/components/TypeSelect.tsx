import React from 'react'

import { Select } from 'antd'

import { useTranslation } from 'react-i18next'
import useKeyTypes from '@/hooks/useKeyTypes'
import VersionAccess from '@/components/VersionAccess'
const TypeSelect: React.FC<{
  connection: APP.Connection
  onChange: (key: string) => void
}> = (props) => {
  const { t } = useTranslation()

  const keyTypes = useKeyTypes()

  const [value, setValue] = React.useState('')

  const options = React.useMemo(() => {
    return [
      {
        label: t('All'),
        value: ''
      }
    ].concat(keyTypes)
  }, [keyTypes, t])

  return (
    <VersionAccess version="6.0.0" connection={props.connection}>
      <Select
        className="w-28"
        options={options}
        value={value}
        onSelect={(e) => {
          setValue(e)
          props.onChange(e)
        }}
      ></Select>
    </VersionAccess>
  )
}

export default TypeSelect
