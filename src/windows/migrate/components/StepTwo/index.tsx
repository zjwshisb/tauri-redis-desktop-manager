import React from 'react'

import { observer } from 'mobx-react-lite'

import 'mac-scrollbar/dist/mac-scrollbar.css'
import SubmitBar from '../SubmitBar'
import classNames from 'classnames'
import Context from '../../context'
import Header from '../Header'
import { Checkbox, Col, Form, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSourceConnection, useTargetConnection } from '../../hooks'

const StepOne: React.FC = () => {
  const [state, dispatch] = React.useContext(Context)

  const { t } = useTranslation()

  const targetConnection = useTargetConnection()

  const sourceConnection = useSourceConnection()
  const [form] = Form.useForm()

  React.useEffect(() => {
    form.setFieldsValue(state.config)
  }, [form, state.config])

  if (targetConnection === undefined || sourceConnection === undefined) {
    return <></>
  }

  return (
    <div
      className={classNames([
        'w-full flex-col justify-between',
        state.step === 1 ? 'flex' : 'hidden'
      ])}
    >
      <div>
        <Header
          title={t('Config')}
          source={{
            title: sourceConnection.name,
            subTitle: state.value?.source.database?.toString()
          }}
          target={{
            title: targetConnection.name,
            subTitle: state.value?.target.database?.toString()
          }}
        ></Header>
        <div className="p-4 ">
          <Row>
            <Col span={12} offset={6}>
              <Form
                size="small"
                layout="horizontal"
                labelCol={{ span: 12 }}
                form={form}
              >
                <Form.Item
                  label={t('Key Pattern')}
                  name={'pattern'}
                  tooltip={t('For Example:foo、*foo、foo*、*foo*')}
                >
                  <Input
                    placeholder={t('Please Enter {{name}}', {
                      name: t('Key Pattern')
                    }).toString()}
                  ></Input>
                </Form.Item>
                <Form.Item
                  label={t('Replace Target Key')}
                  valuePropName={'checked'}
                  name={'replace'}
                  tooltip={t(
                    'Replace or not If the target database has the key'
                  )}
                >
                  <Checkbox></Checkbox>
                </Form.Item>
                <Form.Item
                  name={'delete'}
                  label={t('Delete Source Key')}
                  valuePropName={'checked'}
                  tooltip={t(
                    'Delete the key or not in the Source database If had migrated to the target'
                  )}
                >
                  <Checkbox></Checkbox>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </div>

      <SubmitBar
        prevProps={{
          onClick() {
            dispatch({
              type: 'step',
              value: 0
            })
          }
        }}
        nextProps={{
          async onClick() {
            dispatch({
              type: 'config',
              value: await form.getFieldsValue()
            })
            dispatch({
              type: 'step',
              value: 2
            })
          }
        }}
      ></SubmitBar>
    </div>
  )
}

export default observer(StepOne)
