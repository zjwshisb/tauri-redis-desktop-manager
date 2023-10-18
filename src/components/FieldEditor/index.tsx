import React from 'react'
import CusModal from '@/components/CusModal'

import FieldInput from '../FieldInput'

const FieldEditor: React.FC<{
  defaultValue: string
  title: React.ReactNode
  trigger: React.ReactElement
  onSubmit: (v: string) => Promise<any>
}> = ({ defaultValue, title, trigger, onSubmit }) => {
  const [value, setValue] = React.useState(defaultValue)

  return (
    <CusModal
      onClear={() => {
        setValue(defaultValue)
      }}
      width={800}
      bodyStyle={{}}
      title={title}
      onOk={async () => await onSubmit(value)}
      trigger={trigger}
    >
      <FieldInput value={value} onChange={setValue}></FieldInput>
    </CusModal>
  )
}

export default FieldEditor
