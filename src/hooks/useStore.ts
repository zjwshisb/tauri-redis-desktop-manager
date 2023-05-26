import React from 'react'
import { storeContext } from '../store'

export default function useStore() {
  return React.useContext(storeContext)
}
