import useStore from '@/hooks/useStore'
import { Form, Select, Tooltip } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Pubsub from '@/components/Page/Pubsub'
import { useForm } from 'antd/es/form/Form'
import { getPageKey } from '@/utils'
import CusModal from '@/components/CusModal'

const Subscribe: React.FC<{
  connection: APP.Connection
  db: number
}> = (props) => {
  const { t } = useTranslation()

  const store = useStore()

  const [form] = useForm()

  return (
    <Tooltip title={t('Pubsub')}>
      <CusModal
        onClear={() => {
          form.resetFields()
        }}
        trigger={<div className="font-bold italic">P</div>}
        title={t('Pubsub')}
        onOk={async () => {
          await form.validateFields().then((data) => {
            const channels = data.channels as string[]
            const key = getPageKey(
              `pubsub:${channels.join(',')}`,
              props.connection,
              props.db
            )
            store.page.addPage({
              key,
              label: key,
              connectionId: props.connection.id,
              children: (
                <Pubsub
                  connection={props.connection}
                  db={props.db}
                  channels={channels}
                ></Pubsub>
              )
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
      </CusModal>
    </Tooltip>
  )
}

export default Subscribe
