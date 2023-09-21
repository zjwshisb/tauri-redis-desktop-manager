import React from 'react'

import { observer } from 'mobx-react-lite'

import 'mac-scrollbar/dist/mac-scrollbar.css'
import SubmitBar from '../SubmitBar'
import classNames from 'classnames'
import Context from '../../context'
import Header from '../Header'
import { useTranslation } from 'react-i18next'
import { type ButtonProps, Descriptions } from 'antd'
import Action, { type ActionRef } from './Action'
import { useSourceConnection, useTargetConnection } from '../../hooks'

const StepOne: React.FC = () => {
  const [state, dispatch] = React.useContext(Context)

  const { t } = useTranslation()

  const [loading, setLoading] = React.useState(false)

  const [status, setStatus] = React.useState<'preview' | 'waiting'>('preview')

  const targetConnection = useTargetConnection()

  const sourceConnection = useSourceConnection()

  const ref = React.createRef<ActionRef>()

  const nextProps: ButtonProps = React.useMemo(() => {
    switch (status) {
      case 'preview': {
        if (!loading) {
          return {
            onClick() {
              ref.current?.loadKeys()
            },
            children: t('Preview')
          }
        } else {
          return {
            onClick() {
              ref.current?.stop()
            },
            danger: true,
            type: 'default',
            children: t('Stop')
          }
        }
      }
      case 'waiting': {
        if (!loading) {
          return {
            onClick() {
              ref.current?.loadKeys()
            },
            children: t('Start')
          }
        } else {
          return {
            onClick() {
              ref.current?.stop()
            },
            danger: true,
            type: 'default',
            children: t('Stop')
          }
        }
      }
    }
    return {}
  }, [loading, ref, status, t])

  if (targetConnection === undefined || sourceConnection === undefined) {
    return <></>
  }

  return (
    <div className={classNames(['w-full flex-col justify-between flex'])}>
      <div>
        <Header
          title={t('Preview')}
          source={{
            title: sourceConnection.name,
            subTitle: state.value?.source.database?.toString()
          }}
          target={{
            title: targetConnection.name,
            subTitle: state.value?.target.database?.toString()
          }}
        ></Header>
        <div className="p-4">
          <Descriptions
            size="small"
            items={[
              {
                label: t('Key Pattern'),
                children: state.config?.pattern
              },
              {
                label: t('Replace Target Key'),
                children: state.config?.replace ? 'yes' : 'no'
              },
              {
                label: t('Delete Source Key'),
                children: state.config?.delete ? 'yes' : 'no'
              }
            ]}
          ></Descriptions>
          <Action
            onKeyLoadStop={() => {
              setLoading(false)
            }}
            onKeyLoadAfter={() => {
              setStatus('waiting')
              setLoading(false)
            }}
            onKeyLoadBefore={() => {
              setStatus('preview')
              setLoading(true)
            }}
            ref={ref}
            config={state.config}
            target={{
              connection: targetConnection,
              database: state.value?.target.database
            }}
            source={{
              connection: sourceConnection,
              database: state.value?.source.database
            }}
          ></Action>
        </div>
      </div>

      <SubmitBar
        nextProps={nextProps}
        prevProps={{
          disabled: loading,
          onClick() {
            dispatch({
              type: 'step',
              value: 1
            })
          }
        }}
      ></SubmitBar>
    </div>
  )
}

export default observer(StepOne)
