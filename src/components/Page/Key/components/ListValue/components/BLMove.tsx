import { Form, Input, Button, Radio, InputNumber } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'

const BLMove: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="6.2.0" connection={connection}>
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/blmove/"
        defaultValue={{
          source: props.keys.name
        }}
        trigger={<Button type="primary">BLMOVE</Button>}
        onSubmit={async (v) => {
          await request<number>('list/blmove', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'BLMOVE'}
      >
        <Form.Item
          name={'source'}
          label={'Source'}
          required
          rules={[{ required: true }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name={'destination'}
          label={'Destination'}
          required
          rules={[{ required: true }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name={'wherefrom'}
          label={'Wherefrom'}
          rules={[{ required: true }]}
        >
          <Radio.Group
            optionType="button"
            options={[
              { label: 'LEFT', value: 'LEFT' },
              { label: 'RIGHT', value: 'RIGHT' }
            ]}
          ></Radio.Group>
        </Form.Item>
        <Form.Item
          name={'whereto'}
          label={'Whereto'}
          rules={[{ required: true }]}
        >
          <Radio.Group
            optionType="button"
            options={[
              { label: 'LEFT', value: 'LEFT' },
              { label: 'RIGHT', value: 'RIGHT' }
            ]}
          ></Radio.Group>
        </Form.Item>
        <Form.Item
          name={'timeout'}
          label="Timeout"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
      </ModalForm>
    </VersionAccess>
  )
}
export default BLMove
