dev:
	LOCAL_IP=$(shell ip route get 8.8.8.8 | sed -n '/src/{s/.*src *\([^ ]*\).*/\1/p;q}'); \
	export LOCAL_IP; \
	npm run mock & npm run dev