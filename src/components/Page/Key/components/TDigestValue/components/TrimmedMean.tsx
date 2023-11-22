import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Row } from 'antd'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

const TrimmedMean: React.FC<{
  keys: APP.TDigestKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="TDIGEST.TRIMMED_MEAN"
      width={500}
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/tdigest.trimmed_mean/"
      onQuery={async (v) => {
        const res = await request<string>(
          'tdigest/trimmed-mean',
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
        <Row gutter={20}>
          <FormInputNumberItem
            span={12}
            name={'low_cut_quantile'}
            label="low_cut_quantile"
            tooltip="Foating-point value in the range [0..1], should be lower than high_cut_quantile"
            required
            inputProps={{
              min: 0,
              max: 1,
              stringMode: true
            }}
          />
          <FormInputNumberItem
            span={12}
            name={'high_cut_quantile'}
            label="high_cut_quantile"
            tooltip="Floating-point value in the range [0..1], should be higher than low_cut_quantile"
            required
            inputProps={{
              min: 0,
              max: 1,
              stringMode: true
            }}
          />
        </Row>
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default TrimmedMean
