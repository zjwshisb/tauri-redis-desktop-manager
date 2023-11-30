import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormListItem from '@/components/Form/FormListItem'
import { Row } from 'antd'
import FormCheckBoxItem from '@/components/Form/FormCheckBoxItem'
import FormSelectItem from '@/components/Form/FormSelectItem'

const ZAdd: React.FC<{
  keys: APP.ZSetKey
  defaultValue: Record<string, any>
  onSuccess: () => void
  trigger?: React.ReactElement
}> = (props) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/zadd/"
      defaultValue={{
        name: props.keys.name,
        ...props.defaultValue
      }}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('zset/zadd', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'ZADD'}
    >
      <BaseKeyForm>
        <FormListItem
          name={'value'}
          renderItem={(f) => {
            return (
              <Row gutter={20}>
                <FormInputJsonItem
                  span={16}
                  name={[f.name, 'field']}
                  label="Member"
                  required
                />
                <FormInputNumberItem
                  name={[f.name, 'value']}
                  label="Score"
                  required
                  span={8}
                  inputProps={{
                    stringMode: true
                  }}
                />
              </Row>
            )
          }}
        ></FormListItem>

        <Row gutter={20}>
          <FormSelectItem
            label="Option"
            name={'option_1'}
            span={6}
            inputProps={{
              options: [
                {
                  label: 'NX',
                  value: 'Nx'
                },
                {
                  label: 'XX',
                  value: 'XX'
                }
              ]
            }}
          />
          <FormSelectItem
            label="Option"
            name={'option_2'}
            span={6}
            inputProps={{
              options: [
                {
                  label: 'LT',
                  value: 'LT'
                },
                {
                  label: 'GT',
                  value: 'GT'
                }
              ]
            }}
          />
          <FormCheckBoxItem label="CH" name={'ch'} span={6} />
          <FormCheckBoxItem label="INCR" name={'incr'} span={6} />
        </Row>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default ZAdd
