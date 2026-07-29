all:
	node build.mjs

.PHONY: typst
typst:
	bash typst/build.sh
