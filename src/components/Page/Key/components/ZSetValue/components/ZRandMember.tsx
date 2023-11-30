import React from 'react'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import ModalQueryForm from '@/components/ModalQueryForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import BaseKeyForm from '../../BaseKeyForm'
import FormCheckBoxItem from '@/components/Form/FormCheckBoxItem'
import { Form } from 'antd'

const ZRandMember: React.FC<{
  keys: APP.ZSetKey
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="6.2.0">
      <ModalQueryForm
        defaultValue={{
          name: props.keys.name
        }}
        width={500}
        documentUrl="https://redis.io/commands/zrandmember/"
        onQuery={async (v) => {
          const res = await request<number>(
            'zset/zrandmember',
            props.keys.connection_id,
            {
              db: props.keys.db,
              ...v
            },
            {
              showNotice: false
            }
          )
          return res.data
        }}
        title={'ZRANDMEMBER'}
      >
        <BaseKeyForm>
          <Form.Item noStyle dependencies={['withscores']}>
            {(f) => {
              const v = f.getFieldValue('withscores')
              return (
                <FormInputNumberItem
                  label="Count"
                  name="count"
                  required={v}
                  inputProps={{
                    stringMode: true,
                    precision: 0
                  }}
                />
              )
            }}
          </Form.Item>

          <FormCheckBoxItem
            name={'withscores'}
            label="Withscore"
          ></FormCheckBoxItem>
        </BaseKeyForm>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default ZRandMember
