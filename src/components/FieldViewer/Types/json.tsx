import { type TypeFormat } from '.'
import React from 'react'
import lodash from 'lodash'
import Error from '../Err'
import JsonView from '@/components/JsonView'

const item: TypeFormat = {
  key: 'json',
  label: 'Json',

  async render(content: string) {
    return await new Promise((resolve) => {
      let error = ''
      try {
        const obj = JSON.parse(content)
        if (lodash.isPlainObject(obj)) {
          resolve(
            <JsonView
              validationMessage="error"
              displayDataTypes={false}
              style={{
                wordBreak: 'break-all',
                color: '#FFFFFF'
              }}
              src={obj}
            ></JsonView>
          )
          return
        } else {
          error = 'Invalid Json Object'
        }
      } catch (e: any) {
        error = e.toString()
      }
      resolve(<Error message={error} />)
    })
  }
}

export default item
