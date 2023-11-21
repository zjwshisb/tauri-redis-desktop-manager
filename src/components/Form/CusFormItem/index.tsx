import { Form, type FormItemProps } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type CusFormItemProps<T> = Omit<FormItemProps, 'label'> & {
  inputProps?: T
  label?: string
  render: (p?: T) => React.ReactElement
  placeholderFormat?: string
  requiredMsg?: string
}

export function CusFormItem<T extends Record<string, any>>(
  p: CusFormItemProps<T>
) {
  const {
    required,
    rules,
    placeholderFormat = 'Please enter {{name}}',
    requiredMsg = 'Please enter {{name}}',
    label = '',
    render,
    inputProps,
    ...other
  } = p

  const { t } = useTranslation()

  const appendRules = React.useMemo(() => {
    const newRule = rules === undefined ? [] : [...rules]
    if (required === true) {
      newRule.push({
        required: true,
        message: t(requiredMsg, {
          name: t(label)
        }).toString()
      })
    }
    return newRule
  }, [label, required, requiredMsg, rules, t])

  const placeholder = React.useMemo(() => {
    return t(placeholderFormat, {
      name: t(label)
    }).toString()
  }, [label, placeholderFormat, t])

  const inputPropsNew = React.useMemo(() => {
    return {
      placeholder,
      ...p.inputProps
    } as unknown as T
  }, [p.inputProps, placeholder])

  return (
    <Form.Item label={t(label)} rules={appendRules} {...other}>
      {render(inputPropsNew)}
    </Form.Item>
  )
}

export default CusFormItem
