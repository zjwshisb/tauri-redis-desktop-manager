import React from 'react'
import { observer } from 'mobx-react-lite'
import { Button, type ButtonProps, Space } from 'antd'
import { useTranslation } from 'react-i18next'

const SubmitBar: React.FC<{
  prevProps?: ButtonProps
  nextProps?: ButtonProps
  extra?: React.ReactNode
}> = (props) => {
  const { t } = useTranslation()

  const { prevProps, nextProps } = props

  return (
    <div className="flex items-end justify-end p-4 bg-[#EEEEEF]">
      <Space>
        <Button {...prevProps}>
          {prevProps?.children !== undefined ? prevProps?.children : t('Prev')}
        </Button>
        <Button type="primary" {...nextProps}>
          {nextProps?.children !== undefined ? nextProps?.children : t('Next')}
        </Button>
        {props.extra}
      </Space>
    </div>
  )
}

export default observer(SubmitBar)
