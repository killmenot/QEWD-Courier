install:
	(cd helm/discovery_service && yarn)
	(cd helm/openehr_service && yarn)

test:
	(cd helm/discovery_service && yarn test)
	(cd helm/openehr_service && yarn test)

lint:
	(cd helm/discovery_service && yarn lint)
	(cd helm/openehr_service && yarn lint)

.PHONY: install test lint