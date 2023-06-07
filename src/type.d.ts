declare namespace APP {
  interface Connection {
    id: number
    host: string
    port: number
    auth: string
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
    extra_type: string
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
}
