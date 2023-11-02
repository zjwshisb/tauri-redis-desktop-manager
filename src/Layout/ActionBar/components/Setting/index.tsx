import { Form, Select, InputNumber, Checkbox } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import { SettingOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import lodash from 'lodash'
import Template from '../Template'
import ModalForm from '@/components/ModalForm'

const Index: React.FC = () => {
  const { i18n, t } = useTranslation()

  const store = useStore()

  return (
    <ModalForm
      defaultValue={{
        ...store.setting.setting
      }}
      onFieldsChange={(v) => {
        if (v.length > 0) {
          if (lodash.isArray(v[0].name)) {
            if (v[0].name.includes('locale')) {
              store.setting.update({
                locale: v[0].value
              })
            }
          }
        }
      }}
      trigger={<Template icon={<SettingOutlined />} title="Setting" />}
      title={t('Setting')}
      onSubmit={async (v) => {
        store.setting.update(v)
      }}
    >
      <Form.Item name="locale" label={t('Language')}>
        <Select
          options={Object.keys(i18n.store.data).map((v) => {
            return {
              value: v,
              label: i18n.store.data[v].label as string
            }
          })}
        ></Select>
      </Form.Item>
      <Form.Item
        name="key_count"
        label={t('Key Load Number')}
        tooltip={t('The COUNT option for command SCAN')}
      >
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item
        name="field_count"
        label={t('Field Load Number')}
        tooltip={t('The COUNT option for command HSCAN,SSCAN,ZSCAN')}
      >
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item
        name="dark_mode"
        label={t('Dark Mode')}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
    </ModalForm>
  )
}
export default observer(Index)
