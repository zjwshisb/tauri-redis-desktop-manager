import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Modal, message } from 'antd'
import request from '@/utils/request'
import { actionIconStyle } from '@/utils/styles'

const Index: React.FC<{
  keys: APP.Key
  field: APP.Field
  onSuccess: (f: APP.Field) => void
}> = ({ field, keys, onSuccess }) => {
  return <DeleteOutlined
    style={actionIconStyle}
   className='hover:cursor-pointer' key={'delete'} onClick={() => {
     Modal.confirm({
       title: 'notice',
       content: `confirm delete <${field.name}>?`,
       onOk () {
         return request('key/hash/hdel', keys.connection_id, {
           name: keys.name,
           fields: [field.name],
           db: keys.db
         }).then(() => {
           message.success('success')
           onSuccess(field)
         })
       }
     })
   }} />
}
export default Index
