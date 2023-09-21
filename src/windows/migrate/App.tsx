import React from 'react'
import { observer } from 'mobx-react-lite'
import AppLayout from '@/components/AppLayout'
import StepOne from './components/StepOne'
import StepTwo from './components/StepTwo'
import StepThree from './components/StepThree'
import reducer from './reducer'
import Context from './context'
import { ConfigProvider } from 'antd'

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    step: 0,
    config: {
      pattern: '',
      replace: false,
      delete: false
    }
  })

  return (
    <AppLayout>
      <ConfigProvider
        theme={{
          components: {
            Form: {
              marginLG: 5
            }
          }
        }}
      >
        <Context.Provider value={[state, dispatch]}>
          <StepOne />
          <StepTwo />
          {state.step === 2 && <StepThree />}
        </Context.Provider>
      </ConfigProvider>
    </AppLayout>
  )
}

export default observer(App)
