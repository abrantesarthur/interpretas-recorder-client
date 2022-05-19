.PHONY: build run

build: src/main.ts tsconfig.json
	tsc

run: build
	node dist/main.js
