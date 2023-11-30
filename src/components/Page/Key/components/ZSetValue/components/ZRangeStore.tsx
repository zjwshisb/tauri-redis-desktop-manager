import React from 'react'
import request from '@/utils/request'

import ModalQueryForm from '@/components/ModalQueryForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'
import { Form, Row } from 'antd'
import FormSelectItem from '@/components/Form/FormSelectItem'
import FormCheckBoxItem from '@/components/Form/FormCheckBoxItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const ZRangeStore: React.FC<{
  keys: APP.ZSetKey
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="6.2.0">
      <ModalQueryForm
        defaultValue={{
          source: props.keys.name
        }}
        width={500}
        documentUrl="https://redis.io/commands/zrangestore/"
        onQuery={async (v) => {
          const res = await request<number>(
            'zset/zrangestore',
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
        title={'ZRANGESTORE'}
      >
        <FormInputItem label="Destination" name={'destination'} required />
        <FormInputItem label="Source" name={'source'} required />
        <Row gutter={20}>
          <FormInputItem label="Min" name="min" required span={12} />
          <FormInputItem label="Max" name="max" required span={12} />
        </Row>
        <Row gutter={20}>
          <Form.Item dependencies={['offset']} noStyle>
            {(f) => {
              const v = f.getFieldValue('offset')
              return (
                <FormSelectItem
                  span={12}
                  required={v !== undefined}
                  label="Order"
                  name={'order'}
                  inputProps={{
                    options: [
                      {
                        label: 'BYSCORE',
                        value: 'BYSCORE'
                      },
                      {
                        label: 'BYLEX',
                        value: 'BYLEX'
                      }
                    ]
                  }}
                ></FormSelectItem>
              )
            }}
          </Form.Item>

          <FormCheckBoxItem
            name={'rev'}
            label="Rev"
            span={12}
          ></FormCheckBoxItem>
        </Row>
        <Row gutter={20}>
          <Form.Item dependencies={['count']} noStyle>
            {(f) => {
              const v = f.getFieldValue('count')
              return (
                <FormInputNumberItem
                  span={12}
                  required={v !== undefined}
                  name={'offset'}
                  label="Offset"
                  inputProps={{
                    stringMode: true,
                    precision: 0
                  }}
                />
              )
            }}
          </Form.Item>
          <Form.Item dependencies={['offset']} noStyle>
            {(f) => {
              const v = f.getFieldValue('offset')
              return (
                <FormInputNumberItem
                  span={12}
                  required={v !== undefined}
                  name={'count'}
                  label="Count"
                  inputProps={{
                    stringMode: true,
                    precision: 0
                  }}
                />
              )
            }}
          </Form.Item>
        </Row>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default ZRangeStore
