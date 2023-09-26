import React from 'react'
import { observer } from 'mobx-react-lite'

import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const LoadMore: React.FC<{
  disabled: boolean
  onGet: () => void
  loading: boolean
  onGetAll: () => void
}> = ({ disabled, onGet, onGetAll, loading }) => {
  const { t } = useTranslation()
  return (
    <div className="flex">
      <div className="flex-1">
        <Button
          disabled={disabled}
          loading={loading}
          icon={<PlusOutlined />}
          block
          onClick={onGet}
        >
          {t('Load More')}
        </Button>
      </div>
      <div className="ml-2 flex-shrink-0">
        <Button
          danger
          icon={<PlusOutlined />}
          type="primary"
          onClick={onGetAll}
          disabled={disabled}
        >
          {t('Load All')}
        </Button>
      </div>
    </div>
  )
}

export default observer(LoadMore)
