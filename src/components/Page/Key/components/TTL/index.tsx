import React from 'react'
import { Input, Tooltip } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import Expire from '../Expire'
import dayjs from 'dayjs'

const TTL: React.FC<{
  keys: APP.Key
  onChange: () => void
}> = ({ keys, onChange }) => {
  const { t } = useTranslation()

  const content = React.useMemo(() => {
    return (
      <Input
        addonBefore={t('TTL')}
        value={keys.ttl}
        addonAfter={
          <Expire keys={keys} onSuccess={onChange} trigger={<EditOutlined />} />
        }
        readOnly
      ></Input>
    )
  }, [keys, onChange, t])

  if (keys.ttl <= -1) {
    return content
  }
  return (
    <Tooltip
      placement="bottom"
      title={dayjs().add(keys.ttl, 's').format('YYYY-MM-DDTHH:mm:ssZ[Z]')}
    >
      {content}
    </Tooltip>
  )
}
export default TTL
