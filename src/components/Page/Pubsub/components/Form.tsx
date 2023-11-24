import { Form } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import CusButton from '@/components/CusButton'
import FormSelectItem from '@/components/Form/FormSelectItem'
import useDatabaseOption from '@/hooks/useDatabaseOption'

export interface SubscribeForm {
  db: number
  channels: string[]
}

const Subscribe: React.FC<{
  connection: APP.Connection
  onChange: (v: SubscribeForm) => void
}> = (props) => {
  const [form] = useForm()

  const options = useDatabaseOption(props.connection)

  return (
    <div className="mb-2">
      <Form layout="inline" form={form}>
        {!props.connection.is_cluster && (
          <FormSelectItem
            label="db"
            className="w-[200px]"
            required
            initialValue={0}
            name="db"
            inputProps={{
              options
            }}
          ></FormSelectItem>
        )}
        <FormSelectItem
          className="w-[200px]"
          label="Channel"
          name="channels"
          required
          inputProps={{
            mode: 'tags'
          }}
        />
        <CusButton
          type="primary"
          onClick={() => {
            form.validateFields().then((res: SubscribeForm) => {
              props.onChange(res)
            })
          }}
        >
          Ok
        </CusButton>
      </Form>
    </div>
  )
}

export default Subscribe
