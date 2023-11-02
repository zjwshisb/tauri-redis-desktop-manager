import React from 'react'
import { Card, Input, Radio } from 'antd'
import lodash from 'lodash'
import { type InteractionProps } from 'react-json-view'
import { useTranslation } from 'react-i18next'
import JsonView from '../JsonView'

const FieldInput: React.FC<{
  value?: string
  onChange?: (v: string) => void
  readOnly?: boolean
}> = (props) => {
  const { readOnly = false, onChange, value } = props

  const [jsonValue, setJsonValue] = React.useState<object>({})
  const defaultValue = React.useRef(value)
  const [types, setTypes] = React.useState<'text' | 'json'>('text')

  React.useEffect(() => {
    if (
      defaultValue.current !== null &&
      defaultValue.current !== undefined &&
      defaultValue.current !== ''
    ) {
      try {
        const json = JSON.parse(defaultValue.current)
        if (lodash.isObject(json)) {
          setJsonValue(json)
          setTypes('json')
        }
      } catch (err) {}
    }
  }, [defaultValue])

  const onJsonChange = React.useCallback(
    (e: InteractionProps) => {
      try {
        if (onChange !== undefined) {
          onChange(JSON.stringify(e.updated_src))
        }
      } catch (err) {}
    },
    [onChange]
  )

  const { t } = useTranslation()

  const children = React.useMemo(() => {
    if (types === 'text') {
      return (
        <Input.TextArea
          readOnly={readOnly}
          placeholder={t('Please Enter').toString()}
          value={value}
          onChange={(e) => {
            if (onChange !== undefined) {
              onChange(e.target.value)
            }
          }}
        ></Input.TextArea>
      )
    } else {
      const onChange = readOnly ? undefined : onJsonChange
      return (
        <Card bodyStyle={{ padding: 8 }}>
          <JsonView
            style={{
              wordBreak: 'break-all'
            }}
            src={jsonValue}
            onDelete={onChange}
            onEdit={onChange}
            onAdd={onChange}
          ></JsonView>
        </Card>
      )
    }
  }, [jsonValue, onChange, onJsonChange, readOnly, t, types, value])

  return (
    <div>
      {children}
      <div className="mt-1">
        <Radio.Group
          size="small"
          onChange={(e) => {
            setTypes(e.target.value)
            if (value === undefined || value === '') {
              setJsonValue({})
            } else {
              try {
                setJsonValue(JSON.parse(value))
              } catch (e) {}
            }
          }}
          value={types}
        >
          <Radio.Button value="text">Text</Radio.Button>
          <Radio.Button value="json">Json</Radio.Button>
        </Radio.Group>
      </div>
    </div>
  )
}

export default FieldInput
