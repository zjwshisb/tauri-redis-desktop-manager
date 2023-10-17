declare namespace APP {
  interface Connection {
    id: number
    host: string
    name: string
    port: number
    auth: string
    version?: string
    is_cluster: boolean
    readonly: boolean
    ssh_host: string | null
    ssh_passphrase: string | null
    ssh_password: string | null
    ssh_port: number | null
    ssh_private_key: string | null
    ssh_timeout: number | null
    ssh_username: string | null
    nodes?: Node[]
    dbs?: Database[]
    open?: boolean
    err?: string
    loading?: boolean
  }

  interface Database {
    database: number
    count: number
  }

  interface Node {
    config_epoch: string
    port: number
    flags: string
    host: string
    id: string
    link_state: string
    master: string
    ping_sent: number
    pong_recv: number
    slot: string
  }

  interface SlowLog {
    id: number
    processed_at: number
    time: number
    cmd: string
    client_ip: string
    client_name: string
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
    value: string | number | Field[]
  }

  type HashField = Field

  type Key = StringKey | HashKey | ListKey | ZSetKey | SetKey | JsonKey

  type StringKey = BaseKey<'string', string>

  type JsonKey = BaseKey<'ReJSON-RL', string>

  type HashKey = BaseKey<'hash', Field[]>

  type ListKey = BaseKey<'list', string[]>

  type ZSetKey = BaseKey<'zset', ZSetField[]>

  type SetKey = BaseKey<'set', string[]>

  interface IndexValue {
    index: number
    value: string
  }

  interface NameValue {
    name: string
    value: string
  }

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

  interface SingleScanLikeResp<T = string> {
    cursor: string
    values: T[]
  }
  interface ClusterScanLikeResp<T = string> {
    cursor: Array<{
      cursor: string
      node: string
    }>
    values: T[]
  }

  type ScanLikeResp<T = string> = SingleScanLikeResp<T> | ClusterScanLikeResp<T>
}
