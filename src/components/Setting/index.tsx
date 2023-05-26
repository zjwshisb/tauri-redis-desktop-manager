import { Button, Select } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import { SettingOutlined } from '@ant-design/icons'

const Index: React.FC = () => {
  const { i18n, t } = useTranslation()

  return (
    <div className={'py-4 flex align-middle'}>
      <Button icon={<SettingOutlined size={12} />}></Button>
      <Select
        style={{
          marginLeft: '10px'
        }}
        className="w-[200px]"
        value={i18n.language}
        placeholder={t('select language')}
        onChange={(e) => {
          i18n.changeLanguage(e)
        }}
      >
        <Select.Option key={'zh-CN'}>简体中文</Select.Option>
        <Select.Option key={'en'}>English</Select.Option>
      </Select>
    </div>
  )
}
export default observer(Index)
