all:
	node build.ts

check:
	npx tsc --noEmit
