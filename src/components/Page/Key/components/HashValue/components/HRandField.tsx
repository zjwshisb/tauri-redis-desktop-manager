import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import BaseKeyForm from '../../BaseKeyForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormCheckBoxItem from '@/components/Form/FormCheckBoxItem'

const HRandField: React.FC<{
  keys: APP.HashKey
}> = ({ keys }) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="6.2.0">
      <ModalQueryForm
        title="HRANDFIELD"
        width={400}
        documentUrl="https://redis.io/commands/hrandfield/"
        defaultValue={{
          name: keys.name
        }}
        onQuery={async (v) => {
          const res = await request(
            'hash/hrandfield',
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
        <BaseKeyForm>
          <FormInputNumberItem
            name={'value'}
            label="Count"
            dependencies={['field']}
            rules={[
              ({ getFieldValue }) => {
                return {
                  required: getFieldValue('field') === true
                }
              }
            ]}
          />
          <FormCheckBoxItem name={'field'} label="WithValue" />
        </BaseKeyForm>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default HRandField
