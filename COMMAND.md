# Command Support at GUI

Those command which be checked are supported  at  GUI

## generic

- [X] COPY
- [X] DEL
- [X] DUMP
- [ ] EXISTS
- [X] EXPIRE
- [X] EXPIREAT
- [X] EXPIRETIME
- [ ] KEYS
- [ ] MIGRATE
- [X] MOVE
- [ ] OBJECT ENCODING
- [ ] OBJECT FREQ
- [ ] OBJECT IDLETIME
- [ ] OBJECT REFCOUNT
- [X] PERSIST
- [X] PEXPIRE
- [X] PEXPIREAT
- [X] PEXPIRETIME
- [X] PTTL
- [X] RANDOMKEY
- [X] RENAME
- [X] RENAMENX
- [X] RESOTRE
- [X] SCAN
- [ ] SORT
- [ ] SORT_RO
- [ ] TOUCH
- [X] TTL
- [X] TYPE
- [X] UNLINK
- [ ] WAIT
- [ ] WAITAOF

## STRING

- [x] APPEND
- [X] DECR
- [X] DECRBY
- [X] GET
- [X] GETDEL
- [X] GETRANGE
- [X] GETSET
- [X] INCR
- [X] INCRBY
- [X] INCRBYFLOAT
- [X] LCS
- [X] MGET
- [X] MSET
- [ ] ~~MSETNX~~(deprecated)
- [ ] ~~PSETEX~~(deprecated)
- [X] SET
- [ ] ~~SETEX~~(deprecated)
- [ ] ~~SETNX~~(deprecated)
- [X] SETRANGE
- [X] STRLEN
- [ ] ~~SUBSTR~~(deprecated)

## SET

- [x] SADD
- [X] SCARD
- [X] SDIFF
- [X] SDIFFSTORE
- [X] SINTER
- [X] SINTERCARD
- [X] SINTERSTORE
- [X] SISMEMBER
- [X] SMEMBERS
- [X] SMISMEMBER
- [X] SMOVE
- [X] SPOP
- [X] SRANDMEMBER
- [X] SREM
- [X] SSCAN
- [X] SUNION
- [X] SUNIONSTORE

## LIST

- [X] BLMOVE
- [X] BLMPOP
- [X] BLPOP
- [X] BRPOP
- [X] BRPOPLPUSH
- [X] LINDEX
- [X] LINSERT
- [X] LLEN
- [X] LMOVE
- [X] LMPOP
- [X] LOP
- [X] LPOS
- [X] LPUSH
- [X] LPUSHX
- [X] LRANGE
- [X] LREM
- [X] LSET
- [X] LTRIM
- [X] RPOP
- [X] RPOPLPUSH
- [X] RPUSH
- [X] RPUSHX

## Hash

- [X] HEL
- [X] HEXISTS
- [X] HGET
- [X] HGETALL
- [X] HINCRBY
- [X] HINCRBYFLOAT
- [X] HKEYS
- [X] HLEN
- [X] HMGET
- [ ] ~~HMSET~~(deprecated)
- [X] HRANDFIELD
- [X] HSCAN
- [X] HSET
- [X] HSETNX
- [X] HSTRLEN
- [X] HVALS

## Sorted Set

- [ ] BZMPOP
- [ ] BZPOPMAX
- [ ] BZPOPMIN
- [ ] ZADD
- [ ] ZCARD
- [ ] ZCOUNT
- [ ] ZDIFF
- [ ] ZDIFFSTORE
- [ ] ZINCRBY
- [ ] ZINTER
- [ ] ZINTERCARD
- [ ] ZINTERSTORE
- [ ] ZLEXCOUNT
- [ ] ZMPOP
- [ ] ZMSCORE
- [ ] ZPOPMAX
- [ ] ZPOPMIN
- [ ] ZRANDMEMBER
- [ ] ZRANGE
- [ ] ZRANGEBYLEX
- [ ] ZRANGEBYSCORE
- [ ] ZRANGESTORE
- [ ] ZRANK
- [ ] ZREM
- [ ] ZREMRANGEBYLEX
- [ ] ZREMRANGEBYSCORE
- [ ] ZREVRANGE
- [ ] ZREVRANGEBYLEX
- [ ] ZREVRANGEBYSCORE
- [ ] ZREVRANK
- [ ] ZSCAN
- [ ] ZSCORE
- [ ] ZUNION
- [ ] ZUNIONSOTRE

## Pub/Sub

- [ ] PSUBSCRIBE
- [ ] PUBLISH
- [ ] PUBSUB CHANNELS
- [ ] PUBSUB NUMPAT
- [ ] PUBSUB NUMSUB
- [ ] PUBSUB SHARDCHANNELS
- [ ] PUBSUB SHARDNUMSUB
- [ ] PUBSUBSCRIBE
- [ ] SPUBLISH
- [ ] SSUBSCRIBE
- [ ] SUBSCRIBE
- [ ] SUBSUBSCRIBE
- [ ] UNSUBSCRIBE