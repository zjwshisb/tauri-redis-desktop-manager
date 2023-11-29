import React from 'react'

import request from '@/utils/request'

import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormListItem from '@/components/Form/FormListItem'
import { Row } from 'antd'
import ModalQueryForm from '@/components/ModalQueryForm'

const IncrBy: React.FC<{
  keys: APP.TopKKey
  onSuccess: () => void
  defaultValue: Record<string, any>
  trigger?: React.ReactElement
}> = ({ keys, onSuccess, defaultValue, trigger }) => {
  return (
    <ModalQueryForm
      width={400}
      documentUrl="https://redis.io/commands/topk.incrby/"
      defaultValue={{
        name: keys.name,
        ...defaultValue
      }}
      afterQueryClose={onSuccess}
      onQuery={async (v) => {
        const res = await request(
          'topk/incrby',
          keys.connection_id,
          {
            db: keys.db,
            ...v
          },
          {
            showNotice: false
          }
        )
        return res.data
      }}
      title="TOPK.INCRBY"
      trigger={trigger}
    >
      <BaseKeyForm>
        <FormListItem
          name={'value'}
          required
          renderItem={(f) => {
            return (
              <Row gutter={20}>
                <FormInputItem
                  name={[f.name, 'field']}
                  label="Item"
                  span={12}
                  required
                />
                <FormInputNumberItem
                  label="Increment"
                  name={[f.name, 'value']}
                  span={12}
                  required
                />
              </Row>
            )
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default IncrBy
