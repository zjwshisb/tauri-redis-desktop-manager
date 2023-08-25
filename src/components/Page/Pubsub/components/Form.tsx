import { Button, Form, Select } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'antd/es/form/Form'

export interface SubscribeForm {
  db: number
  channels: string[]
}

const Subscribe: React.FC<{
  connection: APP.Connection
  onChange: (v: SubscribeForm) => void
}> = (props) => {
  const { t } = useTranslation()

  const [form] = useForm()

  return (
    <div className="mb-2">
      <Form layout="inline" form={form}>
        {!props.connection.is_cluster && (
          <Form.Item
            className="w-[200px]"
            label="db"
            name="db"
            rules={[{ required: true }]}
            initialValue={0}
          >
            <Select
              options={props.connection.dbs?.map((v) => {
                return {
                  label: v,
                  value: v
                }
              })}
            ></Select>
          </Form.Item>
        )}

        <Form.Item
          className="w-[200px]"
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
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              form.validateFields().then((res: SubscribeForm) => {
                props.onChange(res)
              })
            }}
          >
            {t('Ok')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Subscribe
