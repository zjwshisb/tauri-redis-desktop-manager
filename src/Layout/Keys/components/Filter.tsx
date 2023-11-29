import React from 'react'
import { observer } from 'mobx-react-lite'
import { Input, Tooltip, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'
import TypeSelect from '@/components/TypeSelect'

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

  const handleSearch = React.useCallback(
    (search: string) => {
      dispatch({
        type: 'filter',
        value: {
          search
        }
      })
    },
    [dispatch]
  )

  return (
    <div className="flex item-center p-2">
      <Input.Search
        value={search}
        prefix={
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
        placeholder={t('search').toString()}
        allowClear
        onSearch={(v) => {
          handleSearch(v)
        }}
        onChange={(e) => {
          setSearch(e.target.value)
        }}
      />
      <TypeSelect
        className="!w-32 ml-2 flex-shrink-0"
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
