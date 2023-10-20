import React from 'react'
import { observer } from 'mobx-react-lite'
import { Input, Tooltip, Checkbox } from 'antd'
import { useDebounceFn } from 'ahooks'
import { useTranslation } from 'react-i18next'
import TypeSelect from '@/components/TypeSelect'

import { SearchOutlined } from '@ant-design/icons'
import context from '../context'

const Filter: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const { t } = useTranslation()

  const [state, dispatch] = React.useContext(context)

  const [search, setSearch] = React.useState(state.filter.search)

  React.useEffect(() => {
    setSearch(state.filter.search)
  }, [state.filter.search])

  const onSearchChange = useDebounceFn((search: string) => {
    dispatch({
      type: 'filter',
      value: {
        search
      }
    })
  })

  return (
    <div className="flex item-center p-2">
      <Input
        value={search}
        addonAfter={
          <Tooltip title={t('Exact Search')} placement="bottom">
            <Checkbox
              checked={state.filter.exact}
              onChange={(e) => {
                dispatch({
                  type: 'filter',
                  value: {
                    exact: e.target.checked
                  }
                })
              }}
            />
          </Tooltip>
        }
        prefix={<SearchOutlined />}
        placeholder={t('search').toString()}
        allowClear
        onChange={(e) => {
          setSearch(e.target.value)
          onSearchChange.run(e.target.value)
        }}
      />
      <TypeSelect
        className="!w-28 ml-2 flex-shrink-0"
        selectClassName="w-full"
        value={state.filter.types}
        connection={connection}
        onChange={(e) => {
          dispatch({
            type: 'filter',
            value: {
              types: e
            }
          })
        }}
      />
    </div>
  )
}

export default observer(Filter)
