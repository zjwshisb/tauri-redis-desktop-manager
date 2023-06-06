import useStore from '@/hooks/useStore'
import request from '@/utils/request'
import { CloseCircleFilled } from '@ant-design/icons'
import { Form, Modal, Select, Tooltip } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Pubsub from '@/components/Page/Pubsub'
import { useForm } from 'antd/es/form/Form'
import { getPageKey } from '@/utils'

const Subscribe: React.FC<{
  connection: APP.Connection
  db: number
}> = (props) => {
  const { t } = useTranslation()

  const store = useStore()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const [form] = useForm()

  return (
    <Tooltip title={t('Pubsub')}>
      <Modal
        open={open}
        title={t('Pubsub')}
        okButtonProps={{
          loading
        }}
        onCancel={(e) => {
          e.stopPropagation()
          form.resetFields()
          setOpen(false)
        }}
        onOk={(e) => {
          e.stopPropagation()
          form.validateFields().then((data) => {
            setLoading(true)
            const channels = data.channels
            request<string>('pubsub/subscribe', props.connection.id, {
              db: props.db,
              channels
            })
              .then((res) => {
                const key = getPageKey('pubsub', props.connection, props.db)
                store.page.addPage({
                  key,
                  label: key,
                  children: (
                    <Pubsub
                      connection={props.connection}
                      db={props.db}
                      channels={channels}
                      eventName={res.data}
                    ></Pubsub>
                  )
                })
                setOpen(false)
              })
              .finally(() => {
                setLoading(false)
              })
          })
        }}
      >
        <div className="pt-2">
          <Form layout="vertical" form={form}>
            <Form.Item
              label={t('Channel')}
              name={'channels'}
              rules={[{ required: true }]}
            >
              <Select
                mode="tags"
                placeholder={t('Please Enter {{name}}', {
                  name: t('Channel')
                })}
              ></Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <CloseCircleFilled
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
      ></CloseCircleFilled>
    </Tooltip>
  )
}

export default Subscribe
