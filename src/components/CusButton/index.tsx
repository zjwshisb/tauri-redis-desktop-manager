import { Button, Tooltip, type ButtonProps, type TooltipProps } from 'antd'
import { isString } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

const CusButton: React.FC<
  ButtonProps & {
    tooltip?: TooltipProps
  }
> = (props) => {
  const { tooltip, ...buttonProps } = props

  const { type, children, size, icon, ...otherProps } = buttonProps

  const { t } = useTranslation()

  const realType = React.useMemo(() => {
    if (type !== undefined) {
      return type
    }
    if (icon !== undefined && children === undefined) {
      return 'text'
    }
    return 'primary'
  }, [children, icon, type])

  const realSize = React.useMemo(() => {
    if (size !== undefined) {
      return size
    }
    if (realType === 'text') {
      return 'small'
    }
  }, [realType, size])

  const childrenI18n = React.useMemo(() => {
    if (isString(children)) {
      return t(children)
    }
    return children
  }, [children, t])

  const button = (
    <Button type={realType} size={realSize} icon={icon} {...otherProps}>
      {childrenI18n}
    </Button>
  )

  if (tooltip === undefined) {
    return button
  }

  const { placement = 'bottom', ...otherTooltipProps } = tooltip
  let title = tooltip.title

  if (isString(title)) {
    title = t(title)
  }

  return (
    <Tooltip {...otherTooltipProps} title={title} placement={placement}>
      {button}
    </Tooltip>
  )
}
export default CusButton
