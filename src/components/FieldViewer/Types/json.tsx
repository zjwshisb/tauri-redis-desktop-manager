import { type TypeFormat } from '.'
import React from 'react'
import ReactJson from 'react-json-view'
import lodash from 'lodash'
import Error from '../Err'

const item: TypeFormat = {
  key: 'json',
  label: 'json',

  render(content: string) {
    let error = ''
    try {
      const obj = JSON.parse(content)
      if (lodash.isPlainObject(obj)) {
        return (
          <ReactJson
            validationMessage="error"
            displayDataTypes={false}
            indentWidth={2}
            sortKeys={true}
            style={{
              wordBreak: 'break-all'
            }}
            collapseStringsAfterLength={200}
            enableClipboard
            src={obj}
            name={false}
            quotesOnKeys={false}
            collapsed={1}
          ></ReactJson>
        )
      } else {
        error = 'Invalid Json Object'
      }
    } catch (e: any) {
      error = e.toString()
    }
    return <Error message={error} />
  }
}

export default item
