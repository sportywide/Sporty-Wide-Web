## Sporty Wide Web

### Prerequisites:

-   Node 8.x+
-   Vagrant https://www.vagrantup.com/

### Initial setup:

-   Install vagrant plugins: `vagrant plugin install vagrant-hostsupdater` and `vagrant plugin install vagrant-docker-compose`
-   `npm install -g ts-node typescript`
-   `npm run install:dependencies`
-   Rename .env.example to .env and tweak it to your needs
-   Install mkcert: https://github.com/FiloSottile/mkcert
-   Run `mkcert -install` to install a local CA
-   Create self-signed SSL certificates: 

```bash
mkcert --key-file certs/sportywide-key.pem --cert-file certs/sportywide-cert.pem sportywidedev.com *.sportywidedev.com localhost 127.0.0.1 ::1
```

-   Add the following entries to /etc/hosts 

```bash
192.168.50.10 api.sportywidedev.com www.sportywidedev.com
```
- After following the running instructions below, you should be able to access the API at `https://api.sportywidedev.com` and the app at `https://www.sportywidedev.com`

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

#### Running with docker + vagrant (Recommended)

-   Spin up Vagrant development machine: `vagrant up`
-   Wait for docker core services to run 
-   SSH into the machine `vagrant ssh`
-   Start docker application services: `docker compose up`

##### To run just a specified service

`docker-compose up <service>`

##### To debug a service

Run one of the following commands (in Vagrant)

-   `docker ps`: This will show you all the running containers
-   `docker-compose run --rm --entrypoint sh <service>`: This will run the container and open an shell session to debug
-   `docker exec -it <containerId> sh`: This will create a shell session to an already running container. Use `docker ps` to find the container ID

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
