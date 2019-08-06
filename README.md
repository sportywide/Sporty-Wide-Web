## Sporty Wide Web

### Prerequisites:

-   Node 8.x+
-   Docker https://docs.docker.com/install/

### Initial setup:

-   `npm install -g ts-node typescript`
-   `npm run install:dependencies`
-   Rename .env.example to .env and tweak it to your needs

### Services

* Redis: 
    * Database queries caching
    * Queuing tasks
* Postgresql:
* Mailhog:
    * Capturing email locally
* Flyway:
    * Database migration
    
### Project structure

The app is structured into multiple packages:

-   sw-web: contains react code and other related front end assets. Bootstraped by Next.js server (`see src/next-server.js`)
-   sw-api: contains REST API related code. Written in nestjs
-   sw-core: contains common code for back end services (e.g. logging, queueing)
-   sw-schema: contains code specific to database access
-   sw-shared: contains utility code and shared data transfer object (DTO) classes
-   sw-email: a microservice that will be responsible for sending emails, communicate with other services via redis

### Running

#### Running with docker (Recommended)

-   Start core services (postgres, flyway, redis ...) in one tab: `docker compose -f docker-core-services.yml up`
-   Start docker application services in another tab: `docker compose up`

##### To run just a specified service

`docker-compose up <service>`

##### To debug a service

Run one of the following commands

-   `docker-compose run --rm --entrypoint sh <service>`: This will run the container and open an shell session to debug
-   `docker-compose exec -it <container> sh`: This will create a shell session to an already running container. Use `docker ps` to find the container ID

#### Running locally

-   Ensure you have installed all external services on your computer
-   You can override config variables by creating an `.env.development` in `<package>/config` folder. It will override the default variables in config.development.js
-   The following declarations are equivalent

```
(.env.development)
SERVER_URL=5000
```

```
(config.development.js)

module.exports = {
	server_url: 'http://localhost:5000'
};
```

---

```
(.env.development)
DEV_SERVER__HOST=localhost
DEV_SERVER__PORT=1234
```

```
(config.development.js)

module.exports = {
	dev_server: {
		host: 'localhost',
		port: 1234,
	}
};
```

* Run npm command with lerna. Use one of the followings

    * `npx lerna run --scope <package> --stream dev (for only one package)`
    * `npx lerna run --stream dev (for all packages)`


* Install a dependency to a sub package
    * `lerna add [--dev] --scope <package>`
