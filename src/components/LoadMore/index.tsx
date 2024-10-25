import React from 'react'
import { observer } from 'mobx-react-lite'

import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import CusButton from '../CusButton'
import { SizeType } from 'antd/es/config-provider/SizeContext'

const LoadMore: React.FC<{
  disabled: boolean
  onGet: () => void
  loading?: boolean
  onGetAll: () => void
  size?: SizeType
}> = ({ disabled, onGet, onGetAll, loading, size }) => {
  const { t } = useTranslation()
  return (
    <div className="flex">
      <div className="flex-1">
        <CusButton
          size={size}
          type="default"
          disabled={disabled}
          loading={loading}
          icon={<PlusOutlined />}
          block
          onClick={onGet}
        >
          {t('Load More')}
        </CusButton>
      </div>
      <div className="ml-2 flex-shrink-0">
        <CusButton
          size={size}
          danger
          icon={<PlusOutlined />}
          type="primary"
          onClick={onGetAll}
          disabled={disabled}
        >
          {t('Load All')}
        </CusButton>
      </div>
    </div>
  )
}

export default observer(LoadMore)
