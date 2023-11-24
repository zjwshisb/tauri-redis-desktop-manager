import React from 'react'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import { SettingOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import lodash from 'lodash'
import Template from '../Template'
import ModalForm from '@/components/ModalForm'
import FormSelectItem from '@/components/Form/FormSelectItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormCheckBoxItem from '@/components/Form/FormCheckBoxItem'

const Index: React.FC = () => {
  const { i18n } = useTranslation()

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
      title="Setting"
      onSubmit={async (v) => {
        store.setting.update(v)
      }}
    >
      <FormSelectItem
        name="locale"
        label="Language"
        inputProps={{
          options: Object.keys(i18n.store.data).map((v) => {
            return {
              value: v,
              label: i18n.store.data[v].label as string
            }
          })
        }}
      />
      <FormInputNumberItem
        name="key_count"
        label="Key Load Number"
        tooltip="The COUNT option for command SCAN"
        inputProps={{
          min: 1
        }}
      />

      <FormInputNumberItem
        name="field_count"
        label="Field Load Number"
        tooltip="The COUNT option for command HSCAN,SSCAN,ZSCAN"
        inputProps={{
          min: 1
        }}
      />
      <FormCheckBoxItem name="dark_mode" label="Dark Mode" />
    </ModalForm>
  )
}
export default observer(Index)
