import { Form, Button, Radio } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormListItem from '@/components/Form/FormListItem'
import CusInputNumber from '@/components/CusInputNumber'
import CusInput from '@/components/CusInput'

const LMPop: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="7.0.0" connection={connection}>
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/lmpop/"
        defaultValue={{
          keys: [props.keys.name]
        }}
        trigger={<Button type="primary">LMPOP</Button>}
        onSubmit={async (v) => {
          await request<number>('list/lmpop', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'LMPOP'}
      >
        <Form.Item
          name={'numkeys'}
          label={'Numkeys'}
          required
          rules={[{ required: true }]}
        >
          <CusInputNumber min={0} precision={0} />
        </Form.Item>
        <FormListItem
          itemProps={{
            label: 'Keys',
            required: true
          }}
          name="keys"
          renderItem={(field) => {
            return (
              <Form.Item
                name={[field.name]}
                required
                rules={[{ required: true }]}
              >
                <CusInput />
              </Form.Item>
            )
          }}
        ></FormListItem>
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
        <Form.Item name={'count'} label="Count">
          <CusInputNumber min={0} />
        </Form.Item>
      </ModalForm>
    </VersionAccess>
  )
}
export default LMPop
