import useStore from '@/hooks/useStore'
import { Form, Switch } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { getPageKey } from '@/utils'
import { MonitorOutlined } from '@ant-design/icons'
import Monitor from '@/components/Page/Monitor'
import CusModal from '@/components/CusModal'
import { useForm } from 'antd/es/form/Form'

const MonitorIcon: React.FC<{
  connection: APP.Connection
}> = (props) => {
  const { t } = useTranslation()

  const store = useStore()

  const [form] = useForm()

  return (
    <CusModal
      title={t('Monitor')}
      getContainer={() => {
        return document.getElementsByTagName('body')[0]
      }}
      showOkNotice={false}
      onOk={async () => {
        const key = getPageKey('monitor', props.connection)
        store.page.addPage({
          key,
          label: key,
          children: (
            <Monitor
              connection={props.connection}
              file={form.getFieldValue('file')}
            ></Monitor>
          ),
          connectionId: props.connection.id
        })
      }}
      trigger={
        <div className="flex items-center">
          <MonitorOutlined
            onClick={(e) => {
              e.stopPropagation()
            }}
          />
          <div className="ml-2">{t('Monitor')}</div>
        </div>
      }
    >
      {t('Are Sure Open A Monitor Page?')}
      <Form form={form}>
        <Form.Item name={'file'} label={t('Save Log To File')}>
          <Switch></Switch>
        </Form.Item>
      </Form>
    </CusModal>
  )
}

export default MonitorIcon
