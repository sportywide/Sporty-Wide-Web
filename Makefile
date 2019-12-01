buildBase:
	docker build -t sportywide/sportywide-base --target prod .
buildWeb: buildBase
	docker build -t sportywide/sportywide-web --target prod -f packages/sw-web/Dockerfile .
buildApi: buildBase
	docker build -t sportywide/sportywide-api --target prod -f packages/sw-api/Dockerfile .
buildEmail: buildBase
	docker build -t sportywide/sportywide-email --target prod -f packages/sw-email/Dockerfile .
buildAll: buildWeb buildApi buildEmail
