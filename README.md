# Disk LRU server
Disk based key-value LRU storage server for Nodejs

This works as central key-value LRU storage server. A disk based storage can sometimes be better alternative to Redis LRU as capacity of its storage can be expanded more than available RAM.

```bash

docker run gumlet/disk-lru-server

```


These two environment variables can be set to configure LRU server.

```bash

PORT=4001 # port on which the server listens
LRU_SIZE_BYTES=1000000 # lru cache size in bytes. By default it's set to 1 MB.

```