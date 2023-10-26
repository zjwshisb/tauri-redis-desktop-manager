import { Form, InputNumber } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { EditOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import IconButton from '@/components/IconButton'
import FieldInput from '@/components/FieldInput'
import ModalForm from '@/components/ModalForm'

const LSet: React.FC<{
  keys: APP.ListKey
  index: number
  value: string
  onSuccess: (value: string, index: number) => void
}> = (props) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      trigger={<IconButton icon={<EditOutlined />} />}
      onSubmit={async (v) => {
        await request<number>('key/list/lset', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          ...v
        })
        props.onSuccess(v.value, v.index)
      }}
      title={'LSET'}
      defaultValue={{
        index: props.index,
        value: props.value
      }}
    >
      <Form.Item name={'index'} label={t('Index')}>
        <InputNumber readOnly></InputNumber>
      </Form.Item>
      <Form.Item name={'value'} label={t('Value')} rules={[{ required: true }]}>
        <FieldInput></FieldInput>
      </Form.Item>
    </ModalForm>
  )
}
export default LSet
