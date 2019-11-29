buildBase:
	docker build -t sportywide/sportywide-base --target prod .
buildWeb: buildBase
	docker build -t sportywide/sportywide-web --target prod -f packages/sw-web/Dockerfile .

