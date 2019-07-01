NYC = ./main/discovery_service/node_modules/.bin/nyc
COVERALLS = ./main/discovery_service/node_modules/.bin/coveralls

ROOT_DIR := $(shell pwd)
DISCOVERY_SERVICE_DIR := $(ROOT_DIR)/main/discovery_service
OPENEHR_SERVICE_DIR := $(ROOT_DIR)/main/openehr_service

clean:
	(cd main/discovery_service && rm -rf .nyc_output coverage node_modules yarn.lock package-lock.json)
	(cd main/openehr_service && rm -rf .nyc_output coverage node_modules yarn.lock package-lock.json)
	rm -rf .nyc_output coverage

install:
	(cd main/discovery_service && yarn)
	(cd main/openehr_service && yarn)

lint:
	(cd main/discovery_service && yarn lint)
	(cd main/openehr_service && yarn lint)

test:
	(cd main/discovery_service && yarn test)
	(cd main/openehr_service && yarn test)

coverage:
	$(NYC) --cwd $(ROOT_DIR) yarn --cwd $(DISCOVERY_SERVICE_DIR) test
	$(NYC) --no-clean --cwd $(ROOT_DIR) yarn --cwd $(OPENEHR_SERVICE_DIR) test
	$(NYC) report --reporter=lcov --reporter=text

coveralls:
	$(NYC) report --reporter=text-lcov | coveralls



.PHONY: clean install lint test coverage coveralls

# "coveralls": "nyc report --reporter=text-lcov | coveralls"