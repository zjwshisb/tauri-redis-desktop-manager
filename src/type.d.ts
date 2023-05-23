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
  }

  interface Field {
    name: string
    value: string
  }

  type Key = StringKey | HashKey

  type StringKey = BaseKey<'string', string>

  type HashKey = BaseKey<'hash', string[]>
}
