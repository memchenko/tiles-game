dev_linux:
	LOCAL_IP=$(shell ip route get 8.8.8.8 | sed -n '/src/{s/.*src *\([^ ]*\).*/\1/p;q}'); \
	export LOCAL_IP; \
	npm run mock & npm run dev

dev_mac:
	LOCAL_IP=$(shell ipconfig getifaddr en0); \
	export LOCAL_IP; \
	npm run mock & npm run dev

prod_web:
	npm run build:web; \
	cp -f ./src/manifest.json ./build/manifest.json; \
	mkdir ./build/.well-known; \
	cp -f ./twa/assetlinks.json ./build/.well-known/assetlinks.json; \
	node build.js

