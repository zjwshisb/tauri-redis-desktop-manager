import React from 'react'

import { observer } from 'mobx-react-lite'

import 'mac-scrollbar/dist/mac-scrollbar.css'

import { useTranslation } from 'react-i18next'
import { useForm } from 'antd/es/form/Form'
import SubmitBar from '../SubmitBar'
import ConnectionSelect from './ConnectionSelect'
import { message } from 'antd'
import classNames from 'classnames'
import Header from '../Header'
import Context from '../../context'
import { type MigrateItem } from '../../reducer'
import Container from '@/components/Container'

const StepOne: React.FC = () => {
  const { t } = useTranslation()

  const [sourceForm] = useForm<MigrateItem>()
  const [targetForm] = useForm<MigrateItem>()

  const [state, dispatch] = React.useContext(Context)

  return (
    <Container
      level={4}
      className={classNames([
        'w-full flex-col justify-between',
        state.step === 0 ? 'flex' : 'hidden'
      ])}
    >
      <div>
        <Header
          source={{ title: t('Source Database') }}
          target={{ title: t('Target Database') }}
        ></Header>
        <div className="flex pt-4">
          <ConnectionSelect
            form={sourceForm}
            title={t('Source')}
            readonlyDisabled={false}
          />
          <ConnectionSelect
            form={targetForm}
            title={t('Target')}
            readonlyDisabled={true}
          />
        </div>
      </div>
      <SubmitBar
        nextProps={{
          onClick() {
            sourceForm
              .validateFields()
              .then((source) => {
                targetForm.validateFields().then((target) => {
                  if (
                    source.connection_id === target.connection_id &&
                    source.database === target.database
                  ) {
                    message.error(t('Source and Target is the Same'))
                    return
                  }
                  dispatch({
                    type: 'value',
                    value: {
                      source,
                      target
                    }
                  })
                  dispatch({
                    type: 'step',
                    value: 1
                  })
                })
              })
              .catch(() => {
                targetForm.validateFields()
              })
          }
        }}
      />
    </Container>
  )
}

export default observer(StepOne)
