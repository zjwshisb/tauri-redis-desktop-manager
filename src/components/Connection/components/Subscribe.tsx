import useStore from '@/hooks/useStore'
import { Form, Select } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Pubsub from '@/components/Page/Pubsub'
import { useForm } from 'antd/es/form/Form'
import { getPageKey } from '@/utils'
import CusModal from '@/components/CusModal'
import { BookOutlined } from '@ant-design/icons'
import { isNumber } from 'lodash'

const Subscribe: React.FC<{
  connection: APP.Connection
}> = (props) => {
  const { t } = useTranslation()

  const store = useStore()

  const [form] = useForm()

  return (
    <CusModal
      getContainer={() => {
        return document.getElementsByTagName('body')[0]
      }}
      onClear={() => {
        form.resetFields()
      }}
      trigger={
        <div className="flex">
          <BookOutlined />
          <div className="ml-2">{t('Subscribe')}</div>
        </div>
      }
      title={t('Pubsub')}
      onOk={async () => {
        await form.validateFields().then((data) => {
          let db = 0
          if (isNumber(data.db)) {
            db = data.db
          }
          const channels = data.channels as string[]
          const key = getPageKey(
            `pubsub:${channels.join(',')}`,
            props.connection,
            db
          )
          store.page.addPage({
            key,
            label: key,
            type: 'pubsub',
            connection: props.connection,
            channels,
            db,
            children: (
              <Pubsub
                connection={props.connection}
                db={db}
                channels={channels}
              ></Pubsub>
            )
          })
        })
      }}
    >
      <div className="pt-2">
        <Form layout="vertical" form={form}>
          {!props.connection.is_cluster && (
            <Form.Item
              label="db"
              name="db"
              rules={[{ required: true }]}
              initialValue={0}
            >
              <Select
                options={props.connection.dbs.map((v) => {
                  return {
                    label: v,
                    value: v
                  }
                })}
              ></Select>
            </Form.Item>
          )}

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
  )
}

export default Subscribe
