import { App } from 'antd'
import React from 'react'
import { ExportOutlined } from '@ant-design/icons'
import request from '@/utils/request'
import TextArea from 'antd/es/input/TextArea'
import Copy from '@/components/Copy'
import CusButton from '@/components/CusButton'

const Dump: React.FC<{
  keys: APP.Key
}> = (props) => {
  const { modal } = App.useApp()

  return (
    <CusButton
      type="default"
      icon={<ExportOutlined />}
      onClick={() => {
        request<string>('key/dump', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db
        }).then((res) => {
          modal.info({
            icon: false,
            title: 'DUMP',
            maskClosable: true,
            width: 800,
            content: (
              <div className="break-all">
                <Copy content={res.data}>
                  <TextArea
                    autoSize={true}
                    className="hover:cursor-pointer"
                    value={res.data}
                    readOnly={true}
                  ></TextArea>
                </Copy>
              </div>
            )
          })
        })
      }}
    ></CusButton>
  )
}
export default Dump
