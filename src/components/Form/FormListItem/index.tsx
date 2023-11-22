import React from 'react'
import {
  Form,
  Row,
  Col,
  type FormListFieldData,
  type FormItemProps,
  Space
} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import CusButton from '@/components/CusButton'

type FormListItemProps = FormItemProps & {
  renderItem: (f: FormListFieldData, index: number) => React.ReactNode
  canBeZero?: boolean
  showAdd?: boolean
}

const FormListItem: React.FC<FormListItemProps> = (p) => {
  const {
    label = '',
    renderItem,
    showAdd = true,
    canBeZero = false,
    name,
    ...others
  } = p

  return (
    <Form.Item {...others} label={label} className="!mb-0">
      <Form.List name={name}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.length === 0 && canBeZero && (
              <CusButton
                type="dashed"
                onClick={() => {
                  add()
                }}
                icon={<PlusOutlined />}
              ></CusButton>
            )}
            {fields.map((field, index) => {
              return (
                <Row key={field.name} className="item-center mb-4" gutter={20}>
                  <Col span={20}>{renderItem(field, index)}</Col>
                  <Col>
                    <Space>
                      {(index > 0 || canBeZero) && (
                        <CusButton
                          type="dashed"
                          onClick={() => {
                            remove(field.name)
                          }}
                          icon={<DeleteOutlined />}
                        ></CusButton>
                      )}
                      {showAdd && index === 0 && (
                        <CusButton
                          type="dashed"
                          onClick={() => {
                            add()
                          }}
                          icon={<PlusOutlined />}
                        ></CusButton>
                      )}
                    </Space>
                  </Col>
                </Row>
              )
            })}
          </>
        )}
      </Form.List>
    </Form.Item>
  )
}
export default FormListItem
