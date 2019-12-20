buildBase:
	docker build -t sportywide/sportywide-base --target prod .
buildNode:
	$(eval VERSION := $(shell ./get-version))
	docker build -t sportywide/sportywide-node:${VERSION} --target node .
buildWeb: buildBase
	$(eval VERSION := $(shell ./get-version sw-web))
	docker build -t sportywide/sportywide-web:${VERSION} --target prod -f packages/sw-web/Dockerfile .
buildApi: buildBase
	$(eval VERSION := $(shell ./get-version sw-api))
	docker build -t sportywide/sportywide-api:${VERSION} --target prod -f packages/sw-api/Dockerfile .
buildEmail: buildBase
	$(eval VERSION := $(shell ./get-version sw-email))
	docker build -t sportywide/sportywide-email:${VERSION} --target prod -f packages/sw-email/Dockerfile .
buildAll: buildWeb buildApi buildEmail buildNode

pushNode:
	$(eval VERSION := $(shell ./get-version))
	docker push sportywide/sportywide-node:${VERSION}
pushWeb:
	$(eval VERSION := $(shell ./get-version sw-web))
	docker push sportywide/sportywide-web:${VERSION}
pushApi:
	$(eval VERSION := $(shell ./get-version sw-api))
	docker push sportywide/sportywide-api:${VERSION}
pushEmail:
	$(eval VERSION := $(shell ./get-version sw-email))
	docker push sportywide/sportywide-email:${VERSION}
pushAll: pushNode pushWeb pushApi pushEmail
