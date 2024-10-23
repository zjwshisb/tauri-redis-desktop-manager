import { type KeyInfo } from '@/store/key'
import request from '@/utils/request'
import React from 'react'
import VersionAccess from '@/components/VersionAccess'
import ModalForm from '@/components/ModalForm'

import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormCheckBoxItem from '@/components/Form/FormCheckBoxItem'
import FormTextareaItem from '@/components/Form/FormTextAreaItem'
import CusButton from '@/components/CusButton'
import { Icon } from '@iconify/react'

const Restore: React.FC<{
  onSuccess: (name: string) => void
  info: KeyInfo
}> = ({ info, onSuccess }) => {
  return (
    <VersionAccess connection={info.connection} version="2.6.0">
      <ModalForm
        defaultValue={{
          ttl: 0
        }}
        trigger={
          <CusButton
            tooltip={{
              title: 'Restore Key'
            }}
            icon={<Icon icon={'iconoir:database-restore'} fontSize={18} />}
          ></CusButton>
        }
        title={'Restore Key'}
        onSubmit={async (v) => {
          await request('key/restore', info.connection.id, {
            ...v,
            db: info?.db
          }).then(() => {
            onSuccess(v.name)
          })
        }}
      >
        <FormInputItem name="name" label="Key Name" required />
        <FormInputNumberItem
          inputProps={{
            min: 0
          }}
          name="ttl"
          label="TTL"
          required
          tooltip="If ttl is 0 the key is created without any expire, otherwise the specified expire time (in milliseconds) is set."
        />
        <FormTextareaItem
          label="Serialized Value"
          name="value"
          tooltip="The serialized-value created by dump command"
          required
        />
        <VersionAccess connection={info.connection} version="3.0.0">
          <FormCheckBoxItem
            name="replace"
            label="Replace"
            tooltip="Replace exists key"
          />
        </VersionAccess>
      </ModalForm>
    </VersionAccess>
  )
}
export default Restore
