VERSION = $(shell ./get-version)
buildBase:
	docker build --cache-from sportywide/sportywide-base -t sportywide/sportywide-base --target prod .
buildNode:
	docker build --cache-from sportywide/sportywide-node --cache-from sportywide/sportywide-base -t sportywide/sportywide-node:$(VERSION) --target node .
	docker tag sportywide/sportywide-node:$(VERSION) sportywide/sportywide-node
buildWeb: buildBase
	docker build --cache-from sportywide/sportywide-web:build-prod --target build-prod -t sportywide/sportywide-web:build-prod  -f packages/sw-web/Dockerfile .
	docker build --cache-from sportywide/sportywide-web:produles --cache-from sportywide/sportywide-web:build-prod --target produles -t sportywide/sportywide-web:produles -f packages/sw-web/Dockerfile .
	docker build --cache-from sportywide/sportywide-web --cache-from sportywide/sportywide-web:produles --cache-from sportywide/sportywide-web:build-prod -t sportywide/sportywide-web:$(VERSION) --target prod -f packages/sw-web/Dockerfile .
	docker tag sportywide/sportywide-web:$(VERSION) sportywide/sportywide-web
buildApi: buildBase
	docker build --cache-from sportywide/sportywide-api:build-prod --target build-prod -t sportywide/sportywide-api:build-prod  -f packages/sw-api/Dockerfile .
	docker build --cache-from sportywide/sportywide-api:produles --cache-from sportywide/sportywide-api:build-prod --target produles -t sportywide/sportywide-api:produles -f packages/sw-api/Dockerfile .
	docker build --cache-from sportywide/sportywide-api --cache-from sportywide/sportywide-api:produles --cache-from sportywide/sportywide-api:build-prod -t sportywide/sportywide-api:$(VERSION) --target prod -f packages/sw-api/Dockerfile .
	docker tag sportywide/sportywide-api:$(VERSION) sportywide/sportywide-api
buildEmail: buildBase
	docker build --cache-from sportywide/sportywide-email:build-prod --target build-prod -t sportywide/sportywide-email:build-prod  -f packages/sw-email/Dockerfile .
	docker build --cache-from sportywide/sportywide-email:produles --cache-from sportywide/sportywide-email:build-prod --target produles -t sportywide/sportywide-email:produles -f packages/sw-email/Dockerfile .
	docker build --cache-from sportywide/sportywide-email --cache-from sportywide/sportywide-email:produles --cache-from sportywide/sportywide-email:build-prod -t sportywide/sportywide-email:$(VERSION) --target prod -f packages/sw-email/Dockerfile .
	docker tag sportywide/sportywide-email:$(VERSION) sportywide/sportywide-email

buildAll: buildWeb buildApi buildEmail buildNode

pushBase:
	docker push sportywide/sportywide-base
pushNode:
	docker push sportywide/sportywide-node:$(VERSION)
	docker push sportywide/sportywide-node
pushWeb:
	docker push sportywide/sportywide-web:build-prod
	docker push sportywide/sportywide-web:produles
	docker push sportywide/sportywide-web:$(VERSION)
	docker push sportywide/sportywide-web
pushApi:
	docker push sportywide/sportywide-api:build-prod
	docker push sportywide/sportywide-api:produles
	docker push sportywide/sportywide-api:$(VERSION)
	docker push sportywide/sportywide-api
pushEmail:
	docker push sportywide/sportywide-email:build-prod
	docker push sportywide/sportywide-email:produles
	docker push sportywide/sportywide-email:$(VERSION)
	docker push sportywide/sportywide-email
pushAll: pushBase pushNode pushWeb pushApi pushEmail
