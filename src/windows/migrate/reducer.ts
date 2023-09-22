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

export interface State {
  step: 0 | 1
  value?: {
    source: MigrateItem
    target: MigrateItem
  }
}
export type Action = UpdateStep | UpdateValue

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
  }
}
export default reducer
