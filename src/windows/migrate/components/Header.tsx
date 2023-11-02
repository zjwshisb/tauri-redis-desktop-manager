import React from 'react'

import { observer } from 'mobx-react-lite'

import 'mac-scrollbar/dist/mac-scrollbar.css'

import { DatabaseOutlined, DoubleRightOutlined } from '@ant-design/icons'
import Container from '@/components/Container'

const StepOne: React.FC<{
  title?: React.ReactNode
  source: {
    title: string
    subTitle?: string
  }
  target: {
    title: string
    subTitle?: string
  }
}> = ({ source, target, title }) => {
  return (
    <>
      <Container
        className="flex items-center justify-center h-[50px] text-[14px]"
        level={1}
      >
        <div className="flex flex-1 items-center justify-end">
          <div className="px-4 flex flex-col items-center leading-4">
            <span>{source.title}</span>
            {source.subTitle !== undefined && (
              <span className="text-xs">{source.subTitle}</span>
            )}
          </div>
          <DatabaseOutlined
            className="text-[#09990F] text-[20px]"
            size={40}
          ></DatabaseOutlined>
        </div>
        <div className="px-4 flex-shrink-0">
          <DoubleRightOutlined></DoubleRightOutlined>
        </div>
        <div className="flex flex-1 items-center">
          <DatabaseOutlined className="text-[#4B9DF5] text-[20px]"></DatabaseOutlined>
          <div className="px-4 flex flex-col items-center leading-4">
            <span>{target.title}</span>
            {target.subTitle !== undefined && (
              <span className="text-xs">{target.subTitle}</span>
            )}
          </div>
        </div>
      </Container>
      {title !== undefined && (
        <Container level={3} className="py-1 flex justify-center border-b">
          {title}
        </Container>
      )}
    </>
  )
}

export default observer(StepOne)
