import React from 'react'
import { observer } from 'mobx-react-lite'
import AppLayout from '@/components/AppLayout'
import StepOne from './components/StepOne'
import StepTwo from './components/StepTwo'
import reducer from './reducer'
import Context from './context'
import { ConfigProvider } from 'antd'

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    step: 0
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
          {state.step === 1 && <StepTwo />}
        </Context.Provider>
      </ConfigProvider>
    </AppLayout>
  )
}

export default observer(App)
