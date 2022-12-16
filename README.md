## Description

This service will give you IP V4 Address information for the given IP.
It gets data from currently 2 vendors
- Ip Stack
- Ip Registry

The primary source is **IpRegistry** but if fallback is **IpStack**.<br/>
The Vendors are rate limited independently using environment variables. If we reach the rate limit
of 1 vendor we fallback to the second one. If the rate limit is reached for both the service responds with unavailable.

Ip Addresses are cached for a TTL, which can be set using environment variable.

Rate limiting and Caching uses Redis.

### Once you start the server, Swagger documentation is available here (You can test the API)<br />
## [Swagger](http://localhost:3000/api)


## Two ways to run the App

- Locally using Ide or Terminal
- Using docker

### Running using Docker (Recommended)
 - Assuming docker desktop is installed
 - Use any one of the below commands
```bash
# Build image if not available
docker compose up

#Always build a new image
docker compose up --build
```

### Running the app locally

```bash
# Run redis locally for Caching and Rate Limiting
docker run -d -p 6379:6379 --name redis redis:latest

# Set Env Variables
export IP_REGISTRY_API_KEY=6v1z4vmitqip2rmi
export IP_REGISTRY_RATE_LIMIT_TIME=90000
export IP_REGISTRY_REQUEST_LIMIT=2
export IP_REGISTRY_URL=https://api.ipregistry.co
export IP_STACK_API_KEY=4053143565ada4e5b6f139c99f3df822
export IP_STACK_RATE_LIMIT_TIME=90000
export IP_STACK_REQUEST_LIMIT=2
export IP_STACK_URL=http://api.ipstack.com
export REDIS_HOST=127.0.0.1

# Install dependencies
npm install

# development
npm run start

# watch mode (during active development - hot reload)
npm run start:dev
```

## Test

```bash
# e2e tests
npm run test:e2e
```
