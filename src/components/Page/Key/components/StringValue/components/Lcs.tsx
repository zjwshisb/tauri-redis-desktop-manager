import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Row } from 'antd'
import connectionContext from '../../../context'
import VersionAccess from '@/components/VersionAccess'
import FormInputItem from '@/components/Form/FormInputItem'
import FormCheckBoxItem from '@/components/Form/FormCheckBoxItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const Lcs: React.FC<{
  keys: APP.StringKey
}> = ({ keys }) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="7.0.0">
      <ModalQueryForm
        title="LCS"
        width={400}
        documentUrl="https://redis.io/commands/lcs/"
        defaultValue={{
          key1: keys.name
        }}
        onQuery={async (v) => {
          const res = await request(
            'string/lcs',
            keys.connection_id,
            {
              db: keys.db,
              ...v
            },
            {
              showNotice: false
            }
          )
          return res.data
        }}
      >
        <FormInputItem name="key1" label="key1" required />
        <FormInputItem name="key2" label="key2" required />

        <Row gutter={20}>
          <FormCheckBoxItem span={8} name={'len'} label="LEN" />
          <FormCheckBoxItem span={8} name={'idx'} label="IDX" />
          <FormCheckBoxItem
            span={8}
            name={'withmatchlen'}
            label="WITHMATCHLEN"
          />
        </Row>
        <FormInputNumberItem
          name={'minmatchlen'}
          label="MINMATCHLEN"
          inputProps={{
            min: 0,
            precision: 0
          }}
        />
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default Lcs
