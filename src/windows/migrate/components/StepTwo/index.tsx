import React from 'react'

import { observer } from 'mobx-react-lite'

import 'mac-scrollbar/dist/mac-scrollbar.css'
import SubmitBar from '../SubmitBar'
import classNames from 'classnames'
import Context from '../../context'
import Header from '../Header'
import { useTranslation } from 'react-i18next'
import { type ButtonProps, Form, Row, App } from 'antd'
import Action, { type ActionRef } from './Action'
import { useSourceConnection, useTargetConnection } from '../../hooks'
import { getCurrent } from '@tauri-apps/api/window'
import { confirm } from '@tauri-apps/api/dialog'
import { type UnlistenFn } from '@tauri-apps/api/event'
import { useLatest } from 'ahooks'
import Container from '@/components/Container'
import FormInputItem from '@/components/Form/FormInputItem'
import FormCheckBoxItem from '@/components/Form/FormCheckBoxItem'
import CusButton from '@/components/CusButton'

interface ConfigForm {
  pattern: string
  delete: boolean
  replace: boolean
}

const StepTwo: React.FC = () => {
  const [state, dispatch] = React.useContext(Context)

  const { t } = useTranslation()

  const [prevLoading, setPrevLoading] = React.useState(false)
  const [migrateLoading, setMigrateLoading] = React.useState(false)

  const targetConnection = useTargetConnection()

  const { modal } = App.useApp()

  const sourceConnection = useSourceConnection()

  const ref = React.useRef<ActionRef>(null)

  const [config, setConfig] = React.useState<ConfigForm>({
    pattern: '',
    delete: false,
    replace: false
  })

  const [form] = Form.useForm()

  const changeDisabled = React.useMemo(() => {
    return prevLoading || migrateLoading
  }, [migrateLoading, prevLoading])

  const startProps: ButtonProps = React.useMemo(() => {
    if (!migrateLoading) {
      return {
        onClick() {
          modal.confirm({
            title: t('Notice'),
            content: t('Are you sure start migrate those keys?'),
            okButtonProps: {
              type: 'primary'
            },
            onOk() {
              ref.current?.migrate()
            }
          })
        },
        disabled: prevLoading,
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
  }, [migrateLoading, modal, prevLoading, t])

  const previewProps: ButtonProps = React.useMemo(() => {
    if (!prevLoading) {
      return {
        disabled: migrateLoading,
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
        children: t('Stop')
      }
    }
  }, [migrateLoading, prevLoading, ref, t])

  const changeDisabledRef = useLatest(changeDisabled)
  const unListenFn = React.useRef<UnlistenFn>()

  React.useEffect(() => {
    const webview = getCurrent()
    webview
      .onCloseRequested(async (e) => {
        console.log(e)
        if (changeDisabledRef.current) {
          const confirmed = await confirm(
            t('Are you sure stop action and quite?')
          )
          if (confirmed) {
            webview.close()
          }
        } else {
          webview.close()
        }
      })
      .then((f) => {
        unListenFn.current = f
      })
    return () => {
      if (unListenFn.current !== undefined) {
        unListenFn.current()
      }
    }
  }, [changeDisabledRef, t])

  if (targetConnection === undefined || sourceConnection === undefined) {
    return <></>
  }

  return (
    <Container
      className={classNames(['w-full flex-col justify-between flex'])}
      level={4}
    >
      <div>
        <Header
          source={{
            title: sourceConnection.name,
            subTitle: state.value?.source.database?.toString()
          }}
          target={{
            title: targetConnection.name,
            subTitle: state.value?.target.database?.toString()
          }}
        ></Header>
        <Container className="p-4 flex-1" level={4}>
          <div className="mb-4">
            <div className="text-lg font-medium">{t('Setting')}</div>
            <Form<ConfigForm>
              size="small"
              layout="horizontal"
              form={form}
              onValuesChange={(_, v) => {
                setConfig(v)
              }}
              initialValues={{
                pattern: '',
                delete: false,
                replace: false
              }}
            >
              <Row gutter={20}>
                <FormInputItem
                  span={12}
                  label="Key Pattern"
                  name="pattern"
                  tooltip="'*' is not required"
                  inputProps={{
                    disabled: changeDisabled
                  }}
                />
                <FormCheckBoxItem
                  span={6}
                  label="Replace Target Key"
                  name="replace"
                  tooltip="Replace or not If the target database has the key"
                  inputProps={{
                    disabled: changeDisabled
                  }}
                />
                <FormCheckBoxItem
                  span={6}
                  name="delete"
                  label="Delete Source Key"
                  tooltip="Delete the key or not in the Source database If had migrated to the target"
                  inputProps={{
                    disabled: changeDisabled || sourceConnection.readonly
                  }}
                />
              </Row>
            </Form>
          </div>

          <Action
            loading={changeDisabled}
            onKeyLoadChange={(s) => {
              switch (s) {
                case 'stop':
                  setPrevLoading(false)
                  break
                case 'before':
                  setPrevLoading(true)
                  break
                case 'finished':
                  setPrevLoading(false)
                  break
              }
            }}
            onMigrateChange={(s) => {
              switch (s) {
                case 'stop':
                  setMigrateLoading(false)
                  break
                case 'before':
                  setMigrateLoading(true)
                  break
                case 'finished':
                  setMigrateLoading(false)
                  break
              }
            }}
            ref={ref}
            config={config}
            target={{
              connection: targetConnection,
              database: state.value?.target.database
            }}
            source={{
              connection: sourceConnection,
              database: state.value?.source.database
            }}
          ></Action>
        </Container>
      </div>
      <SubmitBar
        nextProps={previewProps}
        prevProps={{
          disabled: changeDisabled,
          type: 'default',
          onClick() {
            dispatch({
              type: 'step',
              value: 0
            })
          }
        }}
        extra={
          <CusButton type="primary" {...startProps}>
            {startProps.children}
          </CusButton>
        }
      ></SubmitBar>
    </Container>
  )
}

export default observer(StepTwo)
