# 1. Build Your Own Load Balancer:

## Description

Application layer load balancer that distributes client requests efficiently across multiple servers. Basic solution that answers all the steps as outlined in the [project requirements](https://codingchallenges.fyi/challenges/challenge-load-balancer/).

## Usage:

Initialize the project with `npm link`

1. Start-up the BE servers
```bash
% be <port>
 # available ports: 8080, 8081 and 8082
```

2. Start-up the load balancer
```bash
% lb <interval>
 # set periodic healthcheck interval 
```

3. Make request to load balancer
```bash
% curl http://localhost:3000/
```

4. Make request in parallel
```bash
% curl --parallel --parallel-immediate --parallel-max 3 --config urls.txt
```
#