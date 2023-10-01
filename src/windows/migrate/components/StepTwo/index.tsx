import React from 'react'

import { observer } from 'mobx-react-lite'

import 'mac-scrollbar/dist/mac-scrollbar.css'
import SubmitBar from '../SubmitBar'
import classNames from 'classnames'
import Context from '../../context'
import Header from '../Header'
import { useTranslation } from 'react-i18next'
import {
  type ButtonProps,
  Form,
  Input,
  Checkbox,
  Col,
  Row,
  Button,
  Modal
} from 'antd'
import Action, { type ActionRef } from './Action'
import { useSourceConnection, useTargetConnection } from '../../hooks'
import { getCurrent } from '@tauri-apps/api/window'
import { confirm } from '@tauri-apps/api/dialog'
import { type UnlistenFn } from '@tauri-apps/api/event'
import { useLatest } from 'ahooks'

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
          Modal.confirm({
            title: t('Notice'),
            content: t('Are you sure start migrate those keys?'),
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
  }, [migrateLoading, prevLoading, ref, t])

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
        type: 'default',
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
        if (changeDisabledRef.current) {
          const confirmed = await confirm(
            t('Are you sure stop action and quite?')
          )
          if (!confirmed) {
            e.preventDefault()
          }
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
    <div className={classNames(['w-full flex-col justify-between flex'])}>
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
        <div className="p-4">
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
                <Col span={12}>
                  <Form.Item
                    label={t('Key Pattern')}
                    name={'pattern'}
                    tooltip={t("'*' is not required")}
                  >
                    <Input
                      disabled={changeDisabled}
                      placeholder={t('Please Enter {{name}}', {
                        name: t('Key Pattern')
                      }).toString()}
                    ></Input>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t('Replace Target Key')}
                    valuePropName={'checked'}
                    name={'replace'}
                    tooltip={t(
                      'Replace or not If the target database has the key'
                    )}
                  >
                    <Checkbox disabled={changeDisabled}></Checkbox>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={'delete'}
                    label={t('Delete Source Key')}
                    valuePropName={'checked'}
                    tooltip={t(
                      'Delete the key or not in the Source database If had migrated to the target'
                    )}
                  >
                    <Checkbox
                      disabled={changeDisabled || sourceConnection.readonly}
                    ></Checkbox>
                  </Form.Item>
                </Col>
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
        </div>
      </div>
      <SubmitBar
        nextProps={previewProps}
        prevProps={{
          disabled: changeDisabled,
          onClick() {
            dispatch({
              type: 'step',
              value: 0
            })
          }
        }}
        extra={
          <Button type="primary" {...startProps}>
            {startProps.children}
          </Button>
        }
      ></SubmitBar>
    </div>
  )
}

export default observer(StepTwo)
