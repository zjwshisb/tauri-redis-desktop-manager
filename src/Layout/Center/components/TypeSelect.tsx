import React from 'react'

import { Dropdown, Tooltip } from 'antd'
import { SmallDashOutlined } from '@ant-design/icons'

import { useTranslation } from 'react-i18next'
import { versionCompare } from '@/utils'
import useKeyTypes from '@/hooks/useKeyTypes'
const TypeSelect: React.FC<{
  version: string
  onChange: (key: string) => void
}> = (props) => {
  const { t } = useTranslation()

  const isShowTypeSelect = React.useMemo(() => {
    return versionCompare(props.version, '6.0.0') > -1
  }, [props.version])

  const keyTypes = useKeyTypes()

  if (isShowTypeSelect) {
    return (
      <Tooltip title={t('Type Select')} placement="left">
        <Dropdown
          trigger={['click']}
          menu={{
            selectable: true,
            onSelect(e) {
              props.onChange(e.key)
            },
            items: [
              {
                label: t('All'),
                key: ''
              }
            ].concat(
              keyTypes.map((v) => {
                return {
                  label: v.label,
                  key: v.value
                }
              })
            )
          }}
        >
          <SmallDashOutlined className="hover:cursor-pointer" />
        </Dropdown>
      </Tooltip>
    )
  } else {
    return <></>
  }
}

export default TypeSelect
