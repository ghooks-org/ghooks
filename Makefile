# ------------------------------------------------------------------------------
# ┌─┐┬ ┬┌─┐┌─┐┬┌─┌─┐
# │ ┬├─┤│ ││ │├┴┐└─┐
# └─┘┴ ┴└─┘└─┘┴ ┴└─┘
# ------------------------------------------------------------------------------

BIN=node_modules/.bin

# ------------------------------------------------------------------------------

.PHONY: default
default: install test

# ------------------------------------------------------------------------------

.PHONY: install
install:; @$(call print, "Running install…")
	@npm install --silent
	@npm dedupe --silent

# ------------------------------------------------------------------------------

.PHONY: test
test: test.unit coverage lint

# ------------------------------------------------------------------------------

.PHONY: test.unit
test.unit:; @$(call print, "Running test.unit…")
	@NODE_ENV=test $(BIN)/mocha

# ------------------------------------------------------------------------------

.PHONY: coverage
coverage:; @$(call print, "Running coverage…")
	@mkdir -p coverage
	@NODE_ENV=test $(BIN)/mocha -r blanket -R mocha-cov-reporter

# ------------------------------------------------------------------------------

.PHONY: coverage.show
coverage.show:; @$(call print, "Running coverage.show…")
	@mkdir -p coverage
	@NODE_ENV=test $(BIN)/mocha -r blanket -R html-cov > coverage/index.html
	@open coverage/index.html

# ------------------------------------------------------------------------------

.PHONY: lint
lint:; @$(call print, "Running lint…")
	@$(BIN)/jshint \
		--reporter node_modules/jshint-stylish/stylish.js \
		./

# ------------------------------------------------------------------------------

.PHONY: clean
clean:; @$(call print, "Running clean…")
	@git clean -Xfd

# ------------------------------------------------------------------------------

.PHONY: help
help:
	@echo; echo Makefile Goals; echo
	@tput setaf 2
	@make -qp \
		| awk -F':' '/^[a-zA-Z0-9][^$$#\/\t=]*:([^=]|$$)/ \
		{ split($$1,A,/ /); for(i in A) if (A[i] != "Makefile") print "› "A[i] }' \
		| sort
	@echo
	@tput sgr0

# ------------------------------------------------------------------------------

define print
	@tput setaf 6; tput bold; echo › $1; tput sgr0
endef
