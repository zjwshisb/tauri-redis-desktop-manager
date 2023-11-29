import React from 'react'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import ModalForm from '@/components/ModalForm'
import { Form } from 'antd'

const Merge: React.FC<{
  keys: APP.CountMinKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      title={'CMS.MERGE'}
      documentUrl="https://redis.io/commands/cms.merge/"
      width={800}
      defaultValue={{
        destination: props.keys.name
      }}
      onSubmit={async (v) => {
        const weight = v.weight.filter((v: any) => v != null)
        const res = await request('cms/merge', props.keys.connection_id, {
          db: props.keys.db,
          ...v,
          weight: weight.length > 0 ? weight : undefined
        })
        return res.data
      }}
    >
      <FormInputItem name={'destination'} label="Destination" />
      <FormInputNumberItem
        name={'num_keys'}
        label="NumKeys"
        required
        inputProps={{
          min: 1,
          precision: 0
        }}
      />
      <Form.Item noStyle dependencies={['num_keys']}>
        {(f) => {
          const nums = f.getFieldValue('num_keys')
          f.setFieldsValue({
            source: Array.from({ length: nums }, () => undefined),
            weight: Array.from({ length: nums }, () => undefined)
          })
          if (nums > 0) {
            return (
              <>
                <FormListItem
                  showRemove={false}
                  showAdd={false}
                  name="source"
                  label="Source"
                  required
                  renderItem={(field) => {
                    return <FormInputItem {...field} required />
                  }}
                ></FormListItem>
                <FormListItem
                  showRemove={false}
                  showAdd={false}
                  name="weight"
                  label="Weight"
                  renderItem={(field) => {
                    return (
                      <FormInputNumberItem
                        {...field}
                        inputProps={{
                          stringMode: true
                        }}
                      />
                    )
                  }}
                ></FormListItem>
              </>
            )
          }
        }}
      </Form.Item>
    </ModalForm>
  )
}
export default Merge
