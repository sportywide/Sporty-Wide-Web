## Sporty Wide Web

### Prerequisites:

-   Node 8.x+
-   Docker https://docs.docker.com/install/

### Initial setup:

-   `node bin/install.js`

### Project structure

The app is structured into 4 packages:

-   sw-web: contains react code and other related front end assets. Bootstraped by Next.js server (`see src/next-server.js`)
-   sw-api: contains REST API related code. Written in nestjs
-   sw-schema: contains code specific to database access
-   sw-model: contains utility code and shared data transfer object (DTO) classes

### Running

#### Running with docker (Recommended)

-   Start docker services: `docker compose up`

##### To run just a specified service

`docker-compose up <service>`

##### To debug a service

Run one of the following commands

-   `docker-compose run --rm --entrypoint sh <service>`
-   `docker-compose exec -it <container> sh`

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

-   Run npm command with lerna. Use one of the followings

        	* `lerna run --scope <package> --stream dev (for only one package)`
        	* `lerna run --stream dev (for all packages)`

-   Install a dependency to a sub package

        	`lerna add [--dev] --scope <package>`

### Troubleshooting

-   Module not found. Simply run `npm run bootstrap` from the project folder
-   Files are not synced. Remove the volume with `docker-sync clean` and then restart docker and docker-sync
