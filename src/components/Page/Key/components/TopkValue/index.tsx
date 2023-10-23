import React from 'react'

import useRequest from '@/hooks/useRequest'
import CusTable from '@/components/CusTable'
import { Button, Descriptions, Form, Input, InputNumber, Space } from 'antd'
import ValueLayout from '../ValueLayout'
import request from '@/utils/request'
import useTableColumn from '@/hooks/useTableColumn'
import { PlusOutlined } from '@ant-design/icons'
import IconButton from '@/components/IconButton'
import ModalForm from '@/components/ModalForm'
import { type Field } from 'ahooks/lib/useFusionTable/types'

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
        dataIndex: 'field'
      },
      {
        dataIndex: 'value',
        title: 'count'
      }
    ],
    {
      render(value, record, index) {
        return (
          <Space>
            <ModalForm
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
                <IconButton icon={<PlusOutlined></PlusOutlined>}></IconButton>
              }
            >
              <Form.Item name={'field'} label={'name'}>
                <Input readOnly />
              </Form.Item>
              <Form.Item
                name={'count'}
                label={'count'}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={99999999} />
              </Form.Item>
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
          <div className="mb-4">
            <Descriptions
              size="small"
              bordered
              items={info.map((v) => {
                return {
                  label: v.field,
                  children: v.value
                }
              })}
            ></Descriptions>{' '}
          </div>
        )
      }
      loading={loading}
      actions={
        <ModalForm
          title="TOPK.ADD"
          trigger={<Button type="primary">TOPK.ADD</Button>}
          onSubmit={async (v) => {
            await request('topk/add', keys.connection_id, {
              name: keys.name,
              value: v.value,
              db: keys.db
            }).then(() => {
              onRefresh()
            })
          }}
        >
          <Form.Item required rules={[{ required: true }]} name={'value'}>
            <Input.TextArea />
          </Form.Item>
        </ModalForm>
      }
    >
      <CusTable
        virtual={false}
        rowKey={'name'}
        dataSource={items}
        columns={columns}
      ></CusTable>
    </ValueLayout>
  )
}
export default TopKValue
