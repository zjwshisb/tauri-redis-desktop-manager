import { Button, Modal } from 'antd'
import React from 'react'
import { ExportOutlined } from '@ant-design/icons'
import request from '@/utils/request'
import TextArea from 'antd/es/input/TextArea'
import { useTranslation } from 'react-i18next'
import Copy from '@/components/Copy'

const Dump: React.FC<{
  keys: APP.Key
}> = (props) => {
  const { t } = useTranslation()

  return (
    <Button
      icon={<ExportOutlined />}
      className="mb-2"
      onClick={() => {
        request<string>('key/dump', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db
        }).then((res) => {
          Modal.info({
            title: t('Serialized Value'),
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
    ></Button>
  )
}
export default Dump
