import React from 'react'

import useRequest from '@/hooks/useRequest'
import CusTable from '@/components/CusTable'
import { Descriptions, Space } from 'antd'
import ValueLayout from '../ValueLayout'
import request from '@/utils/request'
import useTableColumn from '@/hooks/useTableColumn'
import { PlusOutlined } from '@ant-design/icons'
import ModalForm from '@/components/ModalForm'
import { type Field } from 'ahooks/lib/useFusionTable/types'
import BaseKeyForm from '../BaseKeyForm'
import FormTextareaItem from '@/components/Form/FormTextAreaItem'
import CusButton from '@/components/CusButton'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const TopKValue: React.FC<{
  keys: APP.TopKKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const {
    data: items,
    fetch,
    loading
  } = useRequest<Array<APP.Field<number>>>(
    'topk/list',
    keys.connection_id,
    {
      db: keys.db,
      name: keys.name
    },
    false
  )

  const { data: info, fetch: infoFetch } = useRequest<Field[]>(
    'topk/info',
    keys.connection_id,
    {
      db: keys.db,
      name: keys.name
    },
    false
  )

  React.useEffect(() => {
    fetch()
    infoFetch()
  }, [fetch, infoFetch, keys])

  const columns = useTableColumn<APP.Field<number>>(
    [
      {
        dataIndex: 'field',
        title: 'Value'
      },
      {
        dataIndex: 'value',
        title: 'Count'
      }
    ],
    {
      render(value, record, index) {
        return (
          <Space>
            <ModalForm
              width={400}
              documentUrl="https://redis.io/commands/topk.incrby/"
              defaultValue={{
                field: record.field,
                count: 1
              }}
              onSubmit={async (v) => {
                await request('topk/incrby', keys.connection_id, {
                  db: keys.db,
                  name: keys.name,
                  field: v.field,
                  value: v.count
                }).then(() => {
                  onRefresh()
                })
              }}
              title="TOPK.INCRBY"
              trigger={
                <CusButton
                  icon={<PlusOutlined></PlusOutlined>}
                  type="link"
                ></CusButton>
              }
            >
              <FormInputItem
                name={'field'}
                label={'name'}
                inputProps={{ readOnly: true }}
              ></FormInputItem>
              <FormInputNumberItem
                name={'count'}
                label={'count'}
                required
                inputProps={{
                  min: 0,
                  max: 99999999
                }}
              ></FormInputNumberItem>
            </ModalForm>
          </Space>
        )
      }
    }
  )

  return (
    <ValueLayout
      header={
        info != null && (
          <Descriptions
            size="small"
            bordered
            items={info.map((v) => {
              return {
                label: v.field,
                children: v.value
              }
            })}
          ></Descriptions>
        )
      }
      loading={loading}
      actions={
        <ModalForm
          documentUrl="https://redis.io/commands/topk.add/"
          title="TOPK.ADD"
          defaultValue={{
            name: keys.name
          }}
          onSubmit={async (v) => {
            await request('topk/add', keys.connection_id, {
              value: v.value,
              db: keys.db
            }).then(() => {
              onRefresh()
            })
          }}
        >
          <BaseKeyForm>
            <FormTextareaItem name={'value'} label="Value"></FormTextareaItem>
          </BaseKeyForm>
        </ModalForm>
      }
    >
      <CusTable
        virtual={false}
        rowKey={'field'}
        dataSource={items}
        columns={columns}
      ></CusTable>
    </ValueLayout>
  )
}
export default TopKValue
