
## Flows
The following branches are used in this example:
* development
  * In this branch is the code for actual development. Can always be committed and push, even _with_ errors. In fact, there is no validation forced.
* test with static analyzers
  * branch name is "test-static-analyzer-passed"
  * The test stage. All files will be validated with `jslint`, `jshint` and `esprima`.
  * Commit and push is only possible with valid files.
  * The working directory is tests/static-analyzer.
  * See the README.md in that directory for the setup and running the tests yourself.
* test API's with unit-tests
  * branch name is "test-unit-tests-passed"
  * Commit and push is only possible with valid files.
  * The working directory for unit-tests is tests/unit-tests.
  * See the README.md in that directory for the setup and running the tests yourself.
* test API's with acceptance
  * branch name is "acceptance"
  * Commit and push is only possible with valid files.
  * The working directory for end to end is tests/e2e.
  * See the README.md in that directory for the setup and running the tests yourself.
* production
  * branch name is "production"
* master
  * This branch is used for production code.

# Installation and configuration
## Install dependencies
See the directories in `/server`, `/tests/static-analyzer` and `/tests/unit-testsz.

Configure the database names in `/data/restoreDatabases.sh`. Rename `books-dev`, `books-tst`, `books-acc` to meet your database names.


## config.js
Configure `config.js` to meet your settings.

Remember that port numbers must be unique. Use the designated port numbers for your project.

Start the deployment server with `forever start server.js`

## Cache credentials
On your deployment server, run `git config --global credential.helper 'cache --timeout=3600000'`

Then run a `git pull`

This will cache your password for the amount of seconds.
 

## Configure github or bitbucket
The `server.js` is configured fot github. It does work out of the box for github. It does _not_ work for bitbucket out of the box. Although the same principle, bitbucket sends a JSON-like string that is not a JSON. You have to figure that out (should be easy).

![Github web configuration](https://raw.githubusercontent.com/theotheu/hook-test/master/assets/github-webhooks.png)













