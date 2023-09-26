import React from 'react'
import { type State, type Action } from './reducer'
// @ts-expect-error no need
const Context = React.createContext<[State, React.Dispatch<Action>]>(null)
export default Context
