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
	mkdir ./build/static/sounds; \
	cp ./public/sounds/* ./build/static/sounds
