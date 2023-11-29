import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormSelectItem from '@/components/Form/FormSelectItem'
import { Form } from 'antd'
import React from 'react'

const CountMinItem: React.FC = () => {
  return (
    <>
      <FormSelectItem
        label="Command"
        name={'command'}
        required
        inputProps={{
          options: [
            {
              label: 'CMS.INITBYPROB',
              value: 'CMS.INITBYPROB'
            },
            {
              label: 'CMS.INITBYDIM',
              value: 'CMS.INITBYDIM'
            }
          ]
        }}
      />
      <Form.Item dependencies={['command']} noStyle>
        {(f) => {
          const command = f.getFieldValue('command')
          if (command === 'CMS.INITBYPROB') {
            return (
              <>
                <FormInputNumberItem
                  inputProps={{
                    stringMode: true
                  }}
                  tooltip={
                    'Estimate size of error. The error is a percent of total counted items. This effects the width of the sketch.'
                  }
                  label="Error"
                  name={'error'}
                  required
                />
                <FormInputNumberItem
                  inputProps={{
                    stringMode: true
                  }}
                  tooltip={
                    'The desired probability for inflated count. This should be a decimal value between 0 and 1. This effects the depth of the sketch. For example, for a desired false positive rate of 0.1% (1 in 1000), error_rate should be set to 0.001. The closer this number is to zero, the greater the memory consumption per item and the more CPU usage per operation.'
                  }
                  label="Probability"
                  name={'probability'}
                  required
                />
              </>
            )
          } else if (command === 'CMS.INITBYDIM') {
            return (
              <>
                <FormInputNumberItem
                  inputProps={{
                    stringMode: true
                  }}
                  tooltip={
                    'Number of counters in each array. Reduces the error size.'
                  }
                  label="Width"
                  name={'width'}
                  required
                />
                <FormInputNumberItem
                  inputProps={{
                    stringMode: true
                  }}
                  tooltip={
                    'Number of counter-arrays. Reduces the probability for an error of a certain size (percentage of total count).'
                  }
                  label="Depth"
                  name={'depth'}
                  required
                />
              </>
            )
          }
        }}
      </Form.Item>
    </>
  )
}
export default CountMinItem
