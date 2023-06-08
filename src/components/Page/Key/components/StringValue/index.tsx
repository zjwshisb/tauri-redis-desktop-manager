import React from 'react'
import { Button, Input, Space, message } from 'antd'
import { useTranslation } from 'react-i18next'
import request from '@/utils/request'

const Index: React.FC<{
  keys: APP.StringKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const [value, setValue] = React.useState(keys.data)

  React.useEffect(() => {
    setValue(keys.data)
  }, [keys.data])

  const [editable, setEditable] = React.useState(false)

  const { t } = useTranslation()

  return (
    <div>
      <div className="pb-2 flex">
        {!editable && (
          <Button
            type="primary"
            onClick={() => {
              setEditable(true)
            }}
          >
            {t('Edit')}
          </Button>
        )}
        {editable && (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                request('key/set', keys.connection_id, {
                  db: keys.db,
                  name: keys.name,
                  value
                }).then(() => {
                  message.success(t('Success'))
                  onRefresh()
                  setEditable(false)
                })
              }}
            >
              {t('Save')}
            </Button>
            <Button
              onClick={() => {
                setValue(keys.data)
                setEditable(false)
              }}
            >
              {t('Cancel')}
            </Button>
          </Space>
        )}
      </div>
      <Input.TextArea
        onChange={(e) => {
          setValue(e.target.value)
        }}
        value={value}
        rows={4}
        readOnly={!editable}
      ></Input.TextArea>
    </div>
  )
}
export default Index
