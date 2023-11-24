import React from 'react'
import { observer } from 'mobx-react-lite'
import { type ButtonProps, Space } from 'antd'
import Container from '@/components/Container'
import CusButton from '@/components/CusButton'

const SubmitBar: React.FC<{
  prevProps?: ButtonProps
  nextProps?: ButtonProps
  extra?: React.ReactNode
}> = (props) => {
  const { prevProps, nextProps } = props

  return (
    <Container className="flex items-end justify-end p-4 " level={2}>
      <Space>
        {prevProps != null && (
          <CusButton {...prevProps}>
            {prevProps?.children !== undefined ? prevProps?.children : 'Prev'}
          </CusButton>
        )}

        <CusButton type="primary" {...nextProps}>
          {nextProps?.children !== undefined ? nextProps?.children : 'Next'}
        </CusButton>
        {props.extra}
      </Space>
    </Container>
  )
}

export default observer(SubmitBar)
