declare namespace APP {
  interface Connection {
    id: number
    host: string
    port: number
    auth: string
    version: string
    is_cluster: boolean
    nodes: string[]
    dbs: number[]
    readonly: boolean
  }

  interface Node {
    config_epoch: string
    flags: string
    host: string
    id: string
    link_state: string
    master: string
    ping_sent: number
    pong_recv: number
    slot: string
  }

  interface BaseKey<T, V> {
    name: string
    types: T
    ttl: number
    memory: number
    data: V
    db: number
    connection_id: number
    length: number
  }

  interface HashField {
    name: string
    value: string
  }

  interface ZSetField {
    value: string
    score: string
  }

  type Key = StringKey | HashKey | ListKey | ZSetKey | SetKey

  type StringKey = BaseKey<'string', string>

  type HashKey = BaseKey<'hash', Field[]>

  type ListKey = BaseKey<'list', string[]>

  type ZSetKey = BaseKey<'zset', ZSetField[]>

  type SetKey = BaseKey<'set', string[]>

  interface EventPayload<T> {
    time: string
    data: T
    success: boolean
    event: string
    id: number
  }

  interface PubsubMessage {
    payload: string
    channel: string
  }

  interface RedisCmd {
     id: string
     cmd: string
     response: string
     host: string
     created_at: string
     duration: number
  }
}
