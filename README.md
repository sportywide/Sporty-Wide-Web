## Sporty Wide Web

### Prerequisites:
* Node 8.x+
* Docker https://docs.docker.com/install/
* Docker Sync https://docker-sync.readthedocs.io/en/latest/getting-started/installation.html

### Initial setup:
* `npm install`
* `npm run bootstrap`


### Project structure
The app is structured into 4 packages:
* sw-web: contains react code and other related front end assets. Bootstraped by Next.js server (`see src/next-server.js`)
* sw-api: contains REST API related code. Written in nestjs
* sw-schema: contains code specific to database access
* sw-model: contains utility code and shared data transfer object (DTO) classes

### Running 

#### Running with docker (Recommended)

* Start docker sync process in the background: `docker synnc start`
* Start docker services: `docker compose up`

##### Install a package.json dependency

* If it is a dependency in the root package.json. Run `docker-compose build base`
* Otherwise, Run `docker-compose build [service]` (see `docker-compose.yml` for the list of available services)

##### To run just a specified service

`docker-compose up <service>`

##### To debug a service

Run one of the following commands
* ```docker-compose run -it --rm <image> sh```
* ```docker-compose exec -it <container> sh```

#### Running locally

* Ensure you have installed all external services on your computer
* You can override config variables by creating an `.env.development` in `<package>/src/config` folder. It will override the default variables in config.development.js

e.g. in `sw-web/src/config/.env.development`

```
SERVER_URL=localhost:5000
```

* Run npm command with lerna. Use one of the followings

	* `lerna run --scope <package> --stream dev (for only one package)`
	* `lerna run --stream dev (for all packages)`
	
* Install a dependency to a sub package

	`lerna add [--dev] --scope <package>` 


### Troubleshooting
* Module not found. Simply run `npm run bootstrap` from the project folder
* Files are not synced. Remove the volume with `docker-sync clean` and then restart docker and docker-sync
