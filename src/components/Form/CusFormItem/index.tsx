import { type ColProps, Form, type FormItemProps, Col } from 'antd'
import { isString } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type CusFormItemProps<T> = FormItemProps & {
  inputProps?: T
  render: (p?: T) => React.ReactElement
  placeholderMsg?: string
  requiredMsg?: string
  span?: ColProps['span']
}

export function CusFormItem<T extends Record<string, any>>(
  p: CusFormItemProps<T>
) {
  const {
    required,
    rules,
    placeholderMsg = 'Please enter {{name}}',
    requiredMsg = 'Please enter {{name}}',
    label = '',
    render,
    inputProps,
    tooltip = undefined,
    span,
    ...other
  } = p

  const { t } = useTranslation()

  const labelI18n = React.useMemo(() => {
    if (isString(label)) {
      return t(label)
    }
    return label
  }, [label, t])

  const tooltipI18n = React.useMemo(() => {
    if (isString(tooltip)) {
      return t(tooltip)
    }
    return undefined
  }, [t, tooltip])

  const appendRules = React.useMemo(() => {
    const newRule = rules === undefined ? [] : [...rules]
    if (required === true) {
      newRule.push({
        required: true,
        message: t(requiredMsg, {
          name: labelI18n
        }).toString()
      })
    }
    return newRule
  }, [labelI18n, required, requiredMsg, rules, t])

  const placeholder = React.useMemo(() => {
    return t(placeholderMsg, {
      name: labelI18n
    }).toString()
  }, [labelI18n, placeholderMsg, t])

  const inputPropsNew = React.useMemo(() => {
    return {
      placeholder,
      ...p.inputProps
    } as unknown as T
  }, [p.inputProps, placeholder])

  const item = React.useMemo(() => {
    return (
      <Form.Item
        label={labelI18n}
        tooltip={tooltipI18n}
        rules={appendRules}
        {...other}
      >
        {render(inputPropsNew)}
      </Form.Item>
    )
  }, [appendRules, inputPropsNew, labelI18n, other, render, tooltipI18n])

  if (span === undefined) {
    return item
  }
  return <Col span={span}>{item}</Col>
}

export default CusFormItem
