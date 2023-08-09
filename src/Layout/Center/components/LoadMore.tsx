import React from 'react'
import { observer } from 'mobx-react-lite'

import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const LoadMore: React.FC<{
  disabled: boolean
  onClick: () => void
  loading: boolean
}> = ({ disabled, onClick, loading }) => {
  const { t } = useTranslation()
  return (
    <div className="p-2 border-t">
      <Button
        disabled={disabled}
        loading={loading}
        icon={<PlusOutlined />}
        block
        onClick={onClick}
      >
        {t('Load More')}
      </Button>
    </div>
  )
}

export default observer(LoadMore)
