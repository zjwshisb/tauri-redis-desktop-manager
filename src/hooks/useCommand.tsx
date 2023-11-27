import { computed } from 'mobx'
import { versionCompare } from '@/utils'

export default function useCommand(
  commands: APP.Command[],
  connection?: APP.Connection
): APP.Command[] {
  return computed(() => {
    return commands.filter((v) => {
      if (v.version === undefined) {
        return true
      }
      if (connection === undefined || connection.version === undefined) {
        return false
      }
      const compare = versionCompare(connection.version, v.version)
      let type = 'greater'
      if (v.type !== undefined) {
        type = v.type
      }
      return type === 'greater' ? compare > -1 : compare < 0
    })
  }).get()
}
