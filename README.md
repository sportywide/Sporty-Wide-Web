## Sporty Wide Web

### Prerequisites:

-   Node 10.x+
-   Vagrant https://www.vagrantup.com/

### Initial setup:

-   Install vagrant plugins `vagrant plugin install vagrant-docker-compose`
-   `npm install -g ts-node typescript`
-   `npm run install:dependencies`
-   Rename .env.example to .env and tweak it to your needs. Note: You can grab credentials from this page: https://sporty-wide.slite.com/app/channels/TsutWVaI3e/collections/SZ98vT6q1Q/notes/Z2rRcShcX6
-   Install mkcert: https://github.com/FiloSottile/mkcert
-   Run `mkcert -install` to install a local CA
-   Create self-signed SSL certificates:

```bash
mkcert --key-file certs/sportywide-key.pem --cert-file certs/sportywide-cert.pem sportywidedev.com *.sportywidedev.com localhost 127.0.0.1 ::1
```

-   Add the following entries to /etc/hosts

```bash
192.168.50.10 sportywidedev.com mail.sportywidedev.com api.sportywidedev.com www.sportywidedev.com proxy.sportywidedev.com
```

-   After following the running instructions below, you should be able to access the API at `https://api.sportywidedev.com` and the app at `https://www.sportywidedev.com`

```
⚠️ **Warning**:
For windows, you will need to disable Hyper-V and Windows Hyper-V platform to run virtualbox. You might also need administrator access to run vagrant up for the first time (as this will need access to change your host files)
(Hyper-V can be found at Control Panel > Turn Windows features on or off)

Another vagrant plugin will need to be installed for NFS to work: https://github.com/winnfsd/vagrant-winnfsd
```

### FAQ

https://sporty-wide.slite.com/app/channels/TsutWVaI3e/collections/SZ98vT6q1Q/notes/1LH4T7OE~l

### Services

-   Redis:
    -   Database queries caching
    -   Queuing tasks
-   Postgresql:
-   Mailhog:
    -   Capturing email locally
-   Flyway:
    -   Database migration

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
-   Run services on your host: lerna run --stream dev

##### To run just a specified service

`lerna run --stream dev --scope sportywide-api`

##### To restart a service

-   `docker-compose -f docker-core-services.yml restart <service>`: This will restart a core service. You might want to use this command to reload the configuration for a service (e.g. traefik) or attempt to rerun a failed database migration (flyway)

##### API testing

Run one of the following commands

-   npm run api-test
