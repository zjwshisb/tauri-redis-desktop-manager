import { type UseKeyScanFilter } from '@/hooks/useKeyScan'

export interface State {
  filter: UseKeyScanFilter
}

export interface Action {
  type: 'filter'
  value: Partial<UseKeyScanFilter>
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'filter':
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.value
        }
      }
  }
}
export default reducer
