# 8. Build Your Own Redis Server:

## Description
Lite Redis server that can handle concurrent clients using the RESP Protocol. Basic solution that answers all the steps as outlined in the [project requirements](https://codingchallenges.fyi/challenges/challenge-redis).

### Core Commands

- **GET**: Fetch the associated value of a given key.
- **SET**: Assign a specific value to a key.
- **DEL**: Erase a key and its corresponding value.
- **EXISTS**: Verify the presence of a key in the system.
- **INCR**: Increment the integer value of a key by 1.
- **DECR**: Decrement the integer value of a key by 1.
- **LPUSH**: Add one or more values to the beginning of a list.
- **RPUSH**: Add one or more values to the end of a list.
- **LRANGE**: Retrieve a subset of the list stored at a key.

### Expiration Commands
> Only passive expiry has been implemented.
- **EX**: Assign a key's time-to-live in seconds.
- **PX**: Designate a key's time-to-live in milliseconds.
- **EXAT**: Pinpoint an exact expiration timestamp for a key in seconds.
- **PXAT**: Pinpoint an exact expiration timestamp for a key in milliseconds.

## Usage:

Initialize the project with `npm link`

- Start-up the Redis Server on default port 6379
```bash
%  ccredis-server
```

## Run tests

```bash
npm test src/redis_server
```