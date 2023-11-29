import React from 'react'
import { Form, type FormListFieldData, type FormItemProps, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import CusButton from '@/components/CusButton'

type FormListItemProps = FormItemProps & {
  renderItem: (f: FormListFieldData, index: number) => React.ReactNode
  canBeZero?: boolean
  showAdd?: boolean
  showRemove?: boolean
}

const FormListItem: React.FC<FormListItemProps> = (p) => {
  const {
    label = '',
    renderItem,
    showAdd = true,
    canBeZero = false,
    showRemove = true,
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
                <div key={field.name} className="flex">
                  <div className="flex-1">{renderItem(field, index)}</div>
                  <div className="flex-shirk-0 ml-2">
                    <Space>
                      {(index > 0 || canBeZero) && showRemove && (
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
                  </div>
                </div>
              )
            })}
          </>
        )}
      </Form.List>
    </Form.Item>
  )
}
export default FormListItem
