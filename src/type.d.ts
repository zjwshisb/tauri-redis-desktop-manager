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
  }

  interface Field {
    name: string
    value: string
  }

  type Key = StringKey | HashKey | ListKey

  type StringKey = BaseKey<'string', string>

  type HashKey = BaseKey<'hash', Field[]>

  type ListKey = BaseKey<'list', string[]>

}
