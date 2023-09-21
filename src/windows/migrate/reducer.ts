export interface MigrateItem {
  connection_id: number
  database?: number
}

interface UpdateStep {
  type: 'step'
  value: State['step']
}
interface UpdateValue {
  type: 'value'
  value: State['value']
}
interface ConfigValue {
  type: 'config'
  value: State['config']
}

export interface State {
  step: 0 | 1 | 2
  value?: {
    source: MigrateItem
    target: MigrateItem
  }
  config: {
    pattern: ''
    replace: boolean
    delete: boolean
  }
}
export type Action = UpdateStep | UpdateValue | ConfigValue

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'step':
      return {
        ...state,
        step: action.value
      }
    case 'value': {
      return {
        ...state,
        value: action.value
      }
    }
    case 'config': {
      return {
        ...state,
        config: action.value
      }
    }
  }
}
export default reducer
