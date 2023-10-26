import React from 'react'
import {
  Button,
  Form,
  Row,
  Col,
  type FormListFieldData,
  type FormItemProps
} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

interface FormListItemProps {
  renderItem: (f: FormListFieldData, index: number) => React.ReactNode
  name: string
  itemProps?: Omit<FormItemProps, 'name'>
  canBeZero?: boolean
}

const FormListItem: React.FC<FormListItemProps> = ({
  renderItem,
  name,
  canBeZero = false,
  itemProps = {}
}) => {
  const { label = 'Value' } = itemProps

  return (
    <Form.Item {...itemProps} label={label}>
      <Form.List name={name}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => {
              return (
                <Row key={field.name} className="item-center" gutter={20}>
                  <Col span={20}>{renderItem(field, index)}</Col>
                  <Col>
                    {(index > 0 || canBeZero) && (
                      <Button
                        type="dashed"
                        onClick={() => {
                          remove(field.name)
                        }}
                        icon={<DeleteOutlined />}
                      ></Button>
                    )}
                  </Col>
                </Row>
              )
            })}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add()
                }}
                block
                icon={<PlusOutlined />}
              ></Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form.Item>
  )
}
export default FormListItem
