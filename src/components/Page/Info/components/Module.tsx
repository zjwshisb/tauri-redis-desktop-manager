import React from 'react'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import CusTable from '@/components/CusTable'

const Module: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {

  const { t } = useTranslation()

  return (
    <Card title={t('Module')} className="w-full">
      <CusTable
        virtual={false}
        rowKey={'name'}
        showFooter={false}
        dataSource={connection.modules || []}
        columns={[
          { dataIndex: 'name', title: 'name', align: 'center' },
          { dataIndex: 'ver', title: 'ver', align: 'center' },
          { dataIndex: 'path', title: 'path', align: 'center' },
          { dataIndex: 'args', title: 'args', align: 'center' }
        ]}
      ></CusTable>
    </Card>
  )
}
export default Module
