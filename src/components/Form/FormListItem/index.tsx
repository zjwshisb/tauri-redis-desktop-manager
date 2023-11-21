import React from 'react'
import {
  Button,
  Form,
  Row,
  Col,
  type FormListFieldData,
  type FormItemProps,
  Space
} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

type FormListItemProps = FormItemProps & {
  renderItem: (f: FormListFieldData, index: number) => React.ReactNode
  canBeZero?: boolean
  showAdd?: boolean
}

const FormListItem: React.FC<FormListItemProps> = (p) => {
  const {
    label = 'Value',
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
            {fields.map((field, index) => {
              return (
                <Row key={field.name} className="item-center" gutter={20}>
                  <Col span={20}>{renderItem(field, index)}</Col>
                  <Col>
                    <Space>
                      {(index > 0 || canBeZero) && (
                        <Button
                          type="dashed"
                          onClick={() => {
                            remove(field.name)
                          }}
                          icon={<DeleteOutlined />}
                        ></Button>
                      )}
                      {showAdd && index === 0 && (
                        <Button
                          type="dashed"
                          onClick={() => {
                            add()
                          }}
                          icon={<PlusOutlined />}
                        ></Button>
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
