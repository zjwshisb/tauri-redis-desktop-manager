import React from 'react'

import { Select } from 'antd'

import { useTranslation } from 'react-i18next'
import useKeyTypes from '@/hooks/useKeyTypes'
import VersionAccess from '@/components/VersionAccess'
const TypeSelect: React.FC<{
  connection: APP.Connection
  onChange: (key: string) => void
  className?: string
  selectClassName?: string
  value?: string
}> = (props) => {
  const { t } = useTranslation()

  const keyTypes = useKeyTypes(props.connection, true)

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
      <div className={props.className}>
        <Select
          allowClear
          onClear={() => {
            props.onChange('')
          }}
          className={props.selectClassName}
          options={options}
          value={props.value}
          onSelect={(e) => {
            props.onChange(e)
          }}
        ></Select>
      </div>
    </VersionAccess>
  )
}

export default TypeSelect
