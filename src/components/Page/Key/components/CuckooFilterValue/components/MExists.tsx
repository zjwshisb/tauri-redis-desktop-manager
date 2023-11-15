import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form } from 'antd'
import FormListItem from '@/components/FormListItem'
import FieldInput from '@/components/FieldInput'
import { useTranslation } from 'react-i18next'

const MExists: React.FC<{
  keys: APP.CuckooFilterKey
}> = ({ keys }) => {
  const { t } = useTranslation()

  return (
    <ModalQueryForm
      title="CF.MEXISTS"
      defaultValue={{
        value: [undefined]
      }}
      width={500}
      documentUrl="https://redis.io/commands/cf.mexists/"
      trigger={<Button type="primary">MEXISTS</Button>}
      onQuery={async (v) => {
        const res = await request<number>(
          'cuckoo-filter/mexists',
          keys.connection_id,
          {
            name: keys.name,
            db: keys.db,
            ...v
          }
        )
        return res.data
      }}
    >
      <FormListItem
        itemProps={{
          tooltip: 'Is an item to check.',
          label: t('Item').toString(),
          required: true,
          rules: [{ required: true }]
        }}
        name="value"
        renderItem={({ key, name, ...restField }) => {
          return (
            <Form.Item
              {...restField}
              name={[name]}
              required={true}
              rules={[{ required: true }]}
            >
              <FieldInput />
            </Form.Item>
          )
        }}
      ></FormListItem>
    </ModalQueryForm>
  )
}
export default MExists
