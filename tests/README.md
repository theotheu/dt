
# Static analyzer
Go to directory `static-analyzer`

Run `./run_lint.sh`

![static-analyze.png](https://raw.githubusercontent.com/theotheu/books/assets/docs/assets/static-analyzer.png)


## Run the app
Run `nodemon` in the server directory.

Requirements:
* imported data (see ./data/README.md)
* up & running application

# Unit tests
## Install mocha
Run `npm install -g mocha`

## Adjust unittest config-test.json
Copy ```config-test.json.default``` to ```config-test.json```.

## Run the tests
Run `mocha`

![unit-tests.png](https://raw.githubusercontent.com/theotheu/books/assets/docs/assets/unit-tests.png)


# End to end tests

![e2e.png](https://raw.githubusercontent.com/theotheu/books/assets/docs/assets/e2e.png)


# Jmeter tests
## Adjust jmeter config.js
Copy ```jmeter.conf.default``` to ```jmeter.conf```.

Adjust configuration

## Run the tests
Run `npm test`
